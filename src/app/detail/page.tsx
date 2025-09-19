'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
// Image imported via fallback component
import ImageWithInitial from '@/components/ui/ImageWithInitial';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import {
  restaurantService,
  FoodyRestaurantDetail,
} from '@/services/restaurantService';
import reviewService from '@/services/reviewService';
import { getRestaurantImage, getMenuItemImage } from '@/lib/imageUtils';
import { formatRupiah } from '@/lib/utils';
import { useAppDispatch } from '@/store/hooks';
import { addToCart, optimisticAddToCart } from '@/store/slices/cartSlice';

function DetailPageInner() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const restaurantId = useMemo(() => {
    const parsed = parseInt(idParam || '', 10);
    return Number.isFinite(parsed) ? parsed : 31;
  }, [idParam]);

  const [detail, setDetail] = useState<FoodyRestaurantDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<
    Array<{
      id: number;
      star: number;
      comment: string;
      createdAt: string;
      user?: { name: string };
    }>
  >([]);
  const [reviewStats, setReviewStats] = useState<{
    totalReviews: number;
    averageRating: number;
  } | null>(null);
  const [visibleMenuCount, setVisibleMenuCount] = useState(8);
  const [activeMenuTab, setActiveMenuTab] = useState<'all' | 'food' | 'drink'>(
    'all'
  );
  const [addingMenuId, setAddingMenuId] = useState<number | null>(null);
  const getMenuKind = (m: { type?: string; foodName?: string }) => {
    const raw = (m.type || '').toLowerCase().trim();
    if (/(drink|minum|beverage|beverages|drinks)/.test(raw)) return 'drink';
    if (
      /(food|makan|dish|meal|snack|main|soup|rice|noodle|dessert|side)/.test(
        raw
      )
    )
      return 'food';
    const name = (m.foodName || '').toLowerCase();
    if (/(tea|coffee|juice|soda|milk|water|latte|lemonade|cola)/.test(name))
      return 'drink';
    return 'food';
  };
  const [reviewPage, setReviewPage] = useState(1);
  const reviewPageSize = 6;
  const [hasMoreReviews, setHasMoreReviews] = useState(false);
  const [isLoadingMoreReviews, setIsLoadingMoreReviews] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await restaurantService.getRestaurantById(restaurantId, {
          limitMenu: 40,
          limitReview: 6,
        });
        if (mounted && res.success) {
          setDetail(res.data);
        }
        // fetch reviews list
        const rev = await reviewService.getByRestaurant(
          restaurantId,
          1,
          reviewPageSize
        );
        if (mounted && rev.success && rev.data) {
          setReviews(rev.data.reviews || []);
          setReviewStats({
            totalReviews: rev.data.statistics?.totalReviews ?? 0,
            averageRating: rev.data.statistics?.averageRating ?? 0,
          });
          const totalPages = rev.data.pagination?.totalPages ?? 1;
          setHasMoreReviews(totalPages > 1);
        }
      } catch (e: unknown) {
        setError((e as Error).message || 'Failed to load detail');
      } finally {
        setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [restaurantId]);

  const galleryImages = (detail?.images || []).filter(Boolean);
  const logo = getRestaurantImage(detail || {});
  return (
    <div className='w-full bg-[#fff] relative overflow-hidden'>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className='flex w-full max-w-[1440px] pt-[80px] pr-[16px] sm:pr-[120px] pb-0 pl-[16px] sm:pl-[120px] flex-col gap-[32px] items-center shrink-0 flex-nowrap relative z-[14] mx-auto'>
        <div className='flex w-full max-w-[1200px] flex-col gap-[32px] items-start shrink-0 flex-nowrap relative z-[15]'>
          {/* Loading / Error */}
          {isLoading && (
            <div className="text-[#0a0d12] font-['Nunito'] text-[14px]">
              Loading detail...
            </div>
          )}
          {error && !isLoading && (
            <div className="text-[#c12116] font-['Nunito'] text-[14px]">
              {error}
            </div>
          )}

          {/* Image Gallery from API only */}
          {galleryImages.length > 0 && (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px] items-stretch self-stretch relative z-[16]'>
              {galleryImages.map((img, idx) => (
                <div
                  key={`${img}-${idx}`}
                  className='w-full h-[240px] sm:h-[300px] lg:h-[320px] relative rounded-[16px] overflow-hidden'
                >
                  <ImageWithInitial
                    src={img}
                    alt={`${detail?.name || 'Restaurant'} gallery ${idx + 1}`}
                    fallbackText={detail?.name || 'Restaurant'}
                    fill
                    className='object-cover'
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  />
                </div>
              ))}
            </div>
          )}

          {/* Restaurant Info */}
          <div className='flex gap-[12px] sm:gap-[16px] items-center self-stretch shrink-0 flex-nowrap relative z-[23]'>
            <div className='w-[80px] h-[80px] sm:w-[120px] sm:h-[120px] shrink-0 rounded-[100px] relative z-[24] overflow-hidden'>
              <ImageWithInitial
                src={logo}
                alt={detail?.name || 'Restaurant'}
                fallbackText={detail?.name || 'Restaurant'}
                fill
                className='object-cover'
                sizes='(max-width: 768px) 80px, 120px'
              />
            </div>
            <div className='flex flex-col gap-[4px] items-start grow shrink-0 basis-0 flex-nowrap relative z-[25]'>
              <span className="h-[32px] sm:h-[42px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[24px] sm:text-[32px] font-extrabold leading-[32px] sm:leading-[42px] text-[#0a0d12] relative text-left whitespace-nowrap z-[26]">
                {detail?.name || 'Restaurant'}
              </span>
              <div className='flex w-[44px] sm:w-[54px] gap-[2px] sm:gap-[4px] items-center self-stretch shrink-0 flex-nowrap relative z-[27]'>
                <div className='w-[18px] h-[18px] sm:w-[24px] sm:h-[24px] shrink-0 bg-[url(/images/1star.svg)] bg-cover bg-no-repeat relative overflow-hidden z-[28]' />
                <span className="flex w-[20px] sm:w-[26px] h-[24px] sm:h-[32px] justify-center items-start shrink-0 basis-auto font-['Nunito'] text-[14px] sm:text-[18px] font-semibold leading-[24px] sm:leading-[32px] text-[#0a0d12] tracking-[-0.36px] relative text-center whitespace-nowrap z-[29]">
                  {detail?.star ?? '-'}
                </span>
              </div>
              <div className='flex gap-[6px] sm:gap-[8px] items-center self-stretch shrink-0 flex-nowrap relative z-30'>
                <span className="h-[24px] sm:h-[32px] shrink-0 basis-auto font-['Nunito'] text-[14px] sm:text-[18px] font-medium leading-[24px] sm:leading-[32px] text-[#0a0d12] relative text-left whitespace-nowrap z-[31]">
                  {detail?.place || '-'}
                </span>
                <div className='w-[2px] h-[2px] shrink-0 bg-[url(/images/dot.png)] bg-cover bg-no-repeat rounded-[50%] relative z-[32]' />
                {typeof detail?.reviewCount === 'number' && (
                  <span className="h-[24px] sm:h-[32px] shrink-0 basis-auto font-['Nunito'] text-[14px] sm:text-[18px] font-medium leading-[24px] sm:leading-[32px] text-[#0a0d12] relative text-left whitespace-nowrap z-[33]">
                    {detail.reviewCount} reviews
                  </span>
                )}
              </div>
            </div>
            <div className='flex w-[100px] sm:w-[140px] h-[36px] sm:h-[44px] pt-[8px] sm:pt-[12px] pr-[12px] sm:pr-[16px] pb-[8px] sm:pb-[12px] pl-[12px] sm:pl-[16px] gap-[8px] sm:gap-[12px] justify-center items-center shrink-0 flex-nowrap rounded-[100px] border-solid border border-[#d5d7da] relative z-[34]'>
              <div className='w-[18px] h-[18px] sm:w-[24px] sm:h-[24px] shrink-0 bg-[url(/images/share-icon.svg)] bg-cover bg-no-repeat relative overflow-hidden z-[35]' />
              <span className="h-[24px] sm:h-[30px] shrink-0 basis-auto font-['Nunito'] text-[12px] sm:text-[16px] font-bold leading-[24px] sm:leading-[30px] text-[#0a0d12] tracking-[-0.32px] relative text-left whitespace-nowrap z-[36]">
                Share
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className='h-px self-stretch shrink-0 bg-[url(/images/divider-line.svg)] bg-cover bg-no-repeat relative z-[37]' />

        {/* Menu Section */}
        <div className='flex flex-col gap-[32px] justify-center items-center self-stretch shrink-0 flex-nowrap relative z-[38]'>
          <div className='flex flex-col gap-[24px] justify-center items-center self-stretch shrink-0 flex-nowrap relative z-[39]'>
            <span className="h-[44px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[36px] font-extrabold leading-[44px] text-[#0a0d12] relative text-left whitespace-nowrap z-40">
              Menu
            </span>
            <div className='flex gap-[12px] items-center self-stretch shrink-0 flex-nowrap relative z-[41]'>
              <button
                onClick={() => {
                  setActiveMenuTab('all');
                  setVisibleMenuCount(8);
                }}
                className={`flex w-[98px] pt-[8px] pr-[16px] pb-[8px] pl-[16px] gap-[8px] justify-center items-center shrink-0 flex-nowrap rounded-[100px] border-solid relative z-[42] ${
                  activeMenuTab === 'all'
                    ? 'bg-[#ffecec] border border-[#c12116]'
                    : 'border border-[#d5d7da]'
                }`}
              >
                <span
                  className={`h-[30px] shrink-0 basis-auto font-['Nunito'] text-[16px] font-bold leading-[30px] tracking-[-0.32px] relative text-left whitespace-nowrap z-[43] ${
                    activeMenuTab === 'all'
                      ? 'text-[#c12116]'
                      : 'text-[#0a0d12]'
                  }`}
                >
                  All Menu
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveMenuTab('food');
                  setVisibleMenuCount(8);
                }}
                className={`flex w-[68px] pt-[8px] pr-[16px] pb-[8px] pl-[16px] gap-[8px] justify-center items-center shrink-0 flex-nowrap rounded-[100px] border-solid relative z-[44] ${
                  activeMenuTab === 'food'
                    ? 'bg-[#ffecec] border border-[#c12116]'
                    : 'border border-[#d5d7da]'
                }`}
              >
                <span
                  className={`h-[30px] shrink-0 basis-auto font-['Nunito'] text-[16px] font-semibold leading-[30px] tracking-[-0.32px] relative text-left whitespace-nowrap z-[45] ${
                    activeMenuTab === 'food'
                      ? 'text-[#c12116]'
                      : 'text-[#0a0d12]'
                  }`}
                >
                  Food
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveMenuTab('drink');
                  setVisibleMenuCount(8);
                }}
                className={`flex w-[71px] pt-[8px] pr-[16px] pb-[8px] pl-[16px] gap-[8px] justify-center items-center shrink-0 flex-nowrap rounded-[100px] border-solid relative z-[46] ${
                  activeMenuTab === 'drink'
                    ? 'bg-[#ffecec] border border-[#c12116]'
                    : 'border border-[#d5d7da]'
                }`}
              >
                <span
                  className={`h-[30px] shrink-0 basis-auto font-['Nunito'] text-[16px] font-semibold leading-[30px] tracking-[-0.32px] relative text-left whitespace-nowrap z-[47] ${
                    activeMenuTab === 'drink'
                      ? 'text-[#c12116]'
                      : 'text-[#0a0d12]'
                  }`}
                >
                  Drink
                </span>
              </button>
            </div>

            {/* Menu Items Grid (from API) */}
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-[10px] sm:gap-[20px] items-stretch self-stretch relative z-[48]'>
              {(detail?.menus || [])
                .filter((m) => {
                  if (activeMenuTab === 'all') return true;
                  const kind = getMenuKind(m);
                  return activeMenuTab === 'food'
                    ? kind === 'food'
                    : kind === 'drink';
                })
                .slice(0, visibleMenuCount)
                .map((m) => (
                  <div
                    key={m.id}
                    className='flex flex-col items-start bg-[#fff] rounded-[16px] relative shadow-[0_0_20px_0_rgba(202,201,201,0.25)] z-[49]'
                  >
                    <div className='h-[285px] self-stretch shrink-0 rounded-tl-[16px] rounded-tr-[16px] rounded-br-none rounded-bl-none relative z-50 overflow-hidden'>
                      <ImageWithInitial
                        src={getMenuItemImage(m.image)}
                        alt={m.foodName}
                        fallbackText={m.foodName}
                        fill
                        className='object-cover'
                        sizes='(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw'
                      />
                    </div>
                    <div className='flex flex-col pt-[16px] pr-[16px] pb-[16px] pl-[16px] gap-[8px] self-stretch shrink-0 flex-nowrap relative z-[51]'>
                      <div className='flex flex-col items-start shrink-0 flex-nowrap relative z-[52]'>
                        <span className="h-[30px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[16px] font-medium leading-[30px] text-[#0a0d12] tracking-[-0.48px] relative text-left whitespace-nowrap z-[53]">
                          {m.foodName}
                        </span>
                        <span className="h-[32px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[18px] font-extrabold leading-[32px] text-[#0a0d12] tracking-[-0.36px] relative text-left whitespace-nowrap z-[54]">
                          {formatRupiah(m.price)}
                        </span>
                      </div>
                      <button
                        onClick={async () => {
                          if (addingMenuId !== null) return;
                          try {
                            setAddingMenuId(m.id);
                            // Immediate UI feedback
                            dispatch(optimisticAddToCart());
                            // Then sync with server
                            await dispatch(
                              addToCart({
                                restaurantId,
                                menuId: m.id,
                                quantity: 1,
                              })
                            ).unwrap();
                          } catch (error) {
                            // Error handling is done in the slice
                            console.error('Failed to add item to cart:', error);
                          } finally {
                            // Reset button state after a short delay
                            setTimeout(() => {
                              setAddingMenuId(null);
                            }, 1000);
                          }
                        }}
                        disabled={addingMenuId === m.id}
                        className='flex w-[79px] h-[40px] pt-[8px] pr-[8px] pb-[8px] pl-[8px] gap-[8px] justify-center items-center shrink-0 flex-nowrap bg-[#c12116] rounded-[100px] relative z-[55] disabled:opacity-60'
                      >
                        <span className="h-[30px] shrink-0 basis-auto font-['Nunito'] text-[16px] font-bold leading-[30px] text-[#fff] tracking-[-0.32px] relative text-left whitespace-nowrap z-[56]">
                          {addingMenuId === m.id ? '✓' : 'Add'}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* Show More / Show Less for Menu Items */}
            {detail?.menus && detail.menus.length > 0 && (
              <div className='flex justify-center items-center w-full mt-[12px]'>
                {(detail.menus || []).filter((m) => {
                  if (activeMenuTab === 'all') return true;
                  return activeMenuTab === 'food'
                    ? getMenuKind(m) === 'food'
                    : getMenuKind(m) === 'drink';
                }).length > visibleMenuCount ? (
                  <button
                    onClick={() => setVisibleMenuCount((c) => c + 8)}
                    className='flex w-[160px] h-[48px] pt-[8px] pr-[8px] pb-[8px] pl-[8px] gap-[8px] justify-center items-center shrink-0 flex-nowrap rounded-[100px] border-solid border border-[#d5d7da] hover:bg-[#f5f5f5] transition-colors cursor-pointer'
                  >
                    <span className="h-[30px] shrink-0 basis-auto font-['Nunito'] text-[16px] font-bold leading-[30px] text-[#0a0d12] tracking-[-0.32px] relative text-left whitespace-nowrap">
                      Show More
                    </span>
                  </button>
                ) : (
                  (detail.menus || []).filter((m) => {
                    if (activeMenuTab === 'all') return true;
                    return activeMenuTab === 'food'
                      ? getMenuKind(m) === 'food'
                      : getMenuKind(m) === 'drink';
                  }).length >= 8 && (
                    <button
                      onClick={() => setVisibleMenuCount(8)}
                      className='flex w-[160px] h-[48px] pt-[8px] pr-[8px] pb-[8px] pl-[8px] gap-[8px] justify-center items-center shrink-0 flex-nowrap rounded-[100px] border-solid border border-[#d5d7da] hover:bg-[#f5f5f5] transition-colors cursor-pointer'
                    >
                      <span className="h-[30px] shrink-0 basis-auto font-['Nunito'] text-[16px] font-bold leading-[30px] text-[#0a0d12] tracking-[-0.32px] relative text-left whitespace-nowrap">
                        Show Less
                      </span>
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className='h-px self-stretch shrink-0 bg-[url(/images/divider-line.svg)] bg-cover bg-no-repeat relative z-[124]' />

        {/* Review Section */}
        <div className='flex flex-col gap-[24px] justify-center items-center self-stretch shrink-0 flex-nowrap relative z-[125]'>
          <div className='flex flex-col gap-[12px] items-start self-stretch shrink-0 flex-nowrap relative z-[126]'>
            <span className="h-[44px] shrink-0 basis-auto font-['Nunito'] text-[24px] sm:text-[36px] font-extrabold leading-[44px] text-[#0a0d12] relative text-left whitespace-nowrap z-[127]">
              Review
            </span>
            <div className='flex gap-[8px] items-center self-stretch shrink-0 flex-nowrap relative z-[128]'>
              <div className='w-[100px] h-[20px] shrink-0 bg-[url(/images/5stars.png)] bg-contain bg-no-repeat relative overflow-hidden z-[129]' />
              <span className="h-[34px] grow shrink-0 basis-auto font-['Nunito'] text-[16px] sm:text-[20px] font-extrabold leading-[34px] text-[#0a0d12] relative text-left whitespace-nowrap z-[130]">
                {String(reviewStats?.averageRating ?? detail?.star ?? '-')} (
                {reviewStats?.totalReviews ?? detail?.reviewCount ?? 0} Reviews)
              </span>
            </div>
          </div>

          {/* Review Cards - All Reviews in 2 Columns */}
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-[20px] items-start justify-center max-w-[1200px] mx-auto relative z-[131]'>
            {(reviews.length ? reviews : []).map((r) => (
              <div
                key={r.id}
                className='flex pt-[16px] pr-[16px] pb-[16px] pl-[16px] flex-col gap-[16px] items-start grow shrink-0 basis-0 flex-nowrap bg-[#fff] rounded-[16px] relative shadow-[0_0_20px_0_rgba(202,201,201,0.25)]'
              >
                <div className='flex w-full max-w-[238px] gap-[12px] items-start'>
                  <div className='w-[64px] h-[64px] shrink-0 bg-[url(/images/profile-photo.png)] bg-cover bg-no-repeat rounded-[50%]' />
                  <div className='flex flex-1 flex-col items-start'>
                    <span className="h-[32px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[16px] sm:text-[18px] font-extrabold leading-[32px] text-[#0a0d12] tracking-[-0.36px] relative text-left whitespace-nowrap">
                      {r.user?.name || 'Anonymous'}
                    </span>
                    <span className="h-[30px] shrink-0 basis-auto font-['Nunito'] text-[14px] sm:text-[16px] font-normal leading-[30px] text-[#0a0d12] tracking-[-0.32px] relative text-left whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className='flex flex-col gap-[8px] items-start self-stretch'>
                  <div className='flex w-[100px] gap-[2px] items-center'>
                    <div className='w-[100px] h-[20px] shrink-0 bg-[url(/images/5stars.png)] bg-contain bg-no-repeat' />
                  </div>
                  <span className="flex w-full justify-start items-start self-stretch shrink-0 font-['Nunito'] text-[14px] sm:text-[16px] font-normal leading-[30px] text-[#0a0d12] tracking-[-0.32px] relative text-left">
                    {r.comment}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Show More Reviews Button */}
          {hasMoreReviews && (
            <div className='flex w-full justify-center relative z-[219]'>
              <button
                onClick={async () => {
                  if (isLoadingMoreReviews) return;
                  setIsLoadingMoreReviews(true);
                  try {
                    const nextPage = reviewPage + 1;
                    const more = await reviewService.getByRestaurant(
                      restaurantId,
                      nextPage,
                      reviewPageSize
                    );
                    if (more && more.success && more.data) {
                      const moreData = more.data;
                      setReviews((prev) => [
                        ...prev,
                        ...(moreData.reviews || []),
                      ]);
                      setReviewPage(nextPage);
                      const totalPages =
                        moreData.pagination?.totalPages ?? nextPage;
                      setHasMoreReviews(nextPage < totalPages);
                    }
                  } finally {
                    setIsLoadingMoreReviews(false);
                  }
                }}
                disabled={isLoadingMoreReviews}
                className='flex w-[160px] h-[48px] pt-[8px] pr-[8px] pb-[8px] pl-[8px] gap-[8px] justify-center items-center shrink-0 flex-nowrap rounded-[100px] border-solid border border-[#d5d7da] hover:bg-[#f5f5f5] transition-colors cursor-pointer disabled:opacity-60'
              >
                <span className="h-[30px] shrink-0 basis-auto font-['Nunito'] text-[16px] font-bold leading-[30px] text-[#0a0d12] tracking-[-0.32px]">
                  {isLoadingMoreReviews ? 'Loading...' : 'Show More'}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function DetailPage() {
  return (
    <Suspense
      fallback={
        <div className='w-full min-h-screen flex items-center justify-center'>
          Loading...
        </div>
      }
    >
      <DetailPageInner />
    </Suspense>
  );
}
