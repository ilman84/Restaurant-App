'use client';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import reviewService from '@/services/reviewService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function ReviewPageInner() {
  const [rating, setRating] = useState<number>(4);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const transactionId = searchParams.get('transactionId') || '';
  const restaurantIdParam = searchParams.get('restaurantId');
  const restaurantId = restaurantIdParam
    ? parseInt(restaurantIdParam, 10)
    : undefined;

  const canSubmit = Boolean(
    transactionId && restaurantId && rating > 0 && text.trim().length > 0
  );

  const handleSubmit = async () => {
    if (!canSubmit || !restaurantId) return;
    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Submitting review:', {
        transactionId,
        restaurantId,
        star: rating,
        comment: text.trim(),
      });
      const res = await reviewService.create({
        transactionId,
        restaurantId,
        star: rating,
        comment: text.trim(),
      });
      console.log('Review response:', res);
      if (res.success) {
        toast.success('Review submitted successfully!', {
          description: 'Thank you for your feedback.',
        });
        router.push(`/detail?id=${restaurantId}`);
      } else {
        const errorMsg = res.message || 'Failed to submit review';
        setError(errorMsg);

        // Show appropriate toast based on error type
        if (res.data && typeof res.data === 'object' && 'status' in res.data) {
          const status = res.data.status;
          if (status === 409) {
            toast.error('Review Already Exists', {
              description:
                'You have already reviewed this restaurant for this order.',
            });
          } else if (status === 400) {
            toast.error('Invalid Data', {
              description: errorMsg,
            });
          } else if (status === 401) {
            toast.error('Authentication Required', {
              description: errorMsg,
            });
          } else if (status === 404) {
            toast.error('Not Found', {
              description: errorMsg,
            });
          } else {
            toast.error('Submission Failed', {
              description: errorMsg,
            });
          }
        } else {
          toast.error('Submission Failed', {
            description: errorMsg,
          });
        }
      }
    } catch (e: unknown) {
      console.error('Review submission error:', e);
      console.error('Error type:', typeof e);
      console.error('Error details:', JSON.stringify(e, null, 2));

      // Handle specific error cases
      if (e && typeof e === 'object' && 'response' in e) {
        const axiosError = e as {
          response?: { status?: number; data?: { message?: string } };
        };
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message;

        if (status === 409) {
          const errorMsg =
            'You have already reviewed this restaurant for this order.';
          setError(errorMsg);
          toast.error('Review Already Exists', {
            description: errorMsg,
          });
        } else if (status === 400) {
          const errorMsg =
            message || 'Invalid review data. Please check your input.';
          setError(errorMsg);
          toast.error('Invalid Data', {
            description: errorMsg,
          });
        } else if (status === 401) {
          const errorMsg = 'Please log in to submit a review.';
          setError(errorMsg);
          toast.error('Authentication Required', {
            description: errorMsg,
          });
        } else if (status === 404) {
          const errorMsg = 'Order or restaurant not found.';
          setError(errorMsg);
          toast.error('Not Found', {
            description: errorMsg,
          });
        } else {
          const errorMsg =
            message || 'Failed to submit review. Please try again.';
          setError(errorMsg);
          toast.error('Submission Failed', {
            description: errorMsg,
          });
        }
      } else {
        const errorMsg = (e as Error).message || 'Failed to submit review';
        setError(errorMsg);
        toast.error('Submission Failed', {
          description: errorMsg,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='w-full min-h-screen bg-[#f8f9fa] relative overflow-hidden'>
      <Navbar />
      <div className='pt-[60px] sm:pt-[80px] w-full overflow-hidden'>
        <div className='w-full max-w-[440px] mx-auto px-4 py-6'>
          <div className='bg-white rounded-[16px] shadow-[0_0_20px_0_rgba(202,201,201,0.25)] p-6'>
            <div className='flex items-start justify-between mb-4'>
              <span className="font-['Nunito'] text-[22px] font-extrabold text-[#0a0d12]">
                Give Review
              </span>
              <button
                type='button'
                aria-label='Close'
                onClick={() => router.back()}
                className='text-[#0a0d12] text-[20px] leading-none hover:opacity-80'
              >
                ×
              </button>
            </div>
            {(!transactionId || !restaurantId) && (
              <div className="mb-3 text-[#c12116] text-[12px] font-['Nunito']">
                Missing transactionId or restaurantId. Open this screen via My
                Orders.
              </div>
            )}
            <div className='text-center mb-3'>
              <span className="font-['Nunito'] text-[14px] font-bold text-[#0a0d12]">
                Give Rating
              </span>
            </div>
            <div className='flex justify-center gap-3 mb-4'>
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  onClick={() => setRating(i)}
                  className='w-[28px] h-[28px]'
                  aria-label={`rate-${i}`}
                >
                  <div
                    className={`w-[28px] h-[28px] bg-[url(/images/1star.svg)] bg-contain bg-no-repeat ${
                      i <= rating ? '' : 'opacity-30'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className='mb-4'>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder='Please share your thoughts about our service!'
                className="w-full h-[200px] rounded-[12px] border border-[#e5e7eb] p-4 outline-none font-['Nunito'] text-[14px] text-[#0a0d12]"
              />
            </div>
            {error && (
              <div className="mb-3 text-[#c12116] text-[12px] font-['Nunito']">
                {error}
              </div>
            )}
            <Button
              className='w-full'
              variant='destructive'
              disabled={!canSubmit || isSubmitting}
              onClick={handleSubmit}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense
      fallback={
        <div className='w-full min-h-screen flex items-center justify-center'>
          Loading...
        </div>
      }
    >
      <ReviewPageInner />
    </Suspense>
  );
}
