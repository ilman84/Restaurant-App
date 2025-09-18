'use client';

import { useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function formatCurrency(n: number): string {
  try {
    return new Intl.NumberFormat('id-ID').format(n);
  } catch {
    return String(n);
  }
}

export default function PaymentSuccessPage() {
  const params = useSearchParams();
  const router = useRouter();

  const ts = params.get('ts');
  const method = params.get('method') || '—';
  const items = Number(params.get('items') || 0);
  const delivery = Number(params.get('delivery') || 0);
  const service = Number(params.get('service') || 0);
  const total = Number(params.get('total') || 0);
  const itemsCount = Number(params.get('itemsCount') || 0);

  const dateStr = useMemo(() => {
    const t = Number(ts || Date.now());
    const d = new Date(t);
    const formatter = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return formatter.format(d);
  }, [ts]);

  return (
    <div className='w-full min-h-screen bg-[#f8f9fa] relative overflow-hidden'>
      <div className='w-full overflow-hidden'>
        <div className='flex w-full max-w-[480px] sm:max-w-[560px] flex-col gap-[16px] items-center mx-auto px-4 py-[32px] sm:py-[48px]'>
          <div className='flex w-full flex-col gap-[16px] items-center bg-[#fff] rounded-[16px] shadow-[0_0_20px_0_rgba(202,201,201,0.25)] relative p-[20px]'>
            <div className='w-[56px] h-[56px] shrink-0 rounded-full bg-[#22c55e] flex items-center justify-center'>
              <div className='w-[28px] h-[28px] bg-[url(/images/ceklis.svg)] bg-contain bg-no-repeat' />
            </div>
            <span className="font-['Nunito'] text-[20px] sm:text-[22px] font-extrabold text-[#0a0d12]">
              Payment Success
            </span>
            <span className="font-['Nunito'] text-[14px] text-[#0a0d12] opacity-80 text-center">
              Your payment has been successfully processed.
            </span>

            <div className='w-full h-px bg-[url(/images/line-payment.svg)] bg-cover bg-no-repeat' />

            <div className='flex w-full flex-col gap-[10px]'>
              <div className='flex justify-between items-center'>
                <span className="font-['Nunito'] text-[14px] text-[#0a0d12]">
                  Date
                </span>
                <span className="font-['Nunito'] text-[14px] font-semibold text-[#0a0d12]">
                  {dateStr}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className="font-['Nunito'] text-[14px] text-[#0a0d12]">
                  Payment Method
                </span>
                <span className="font-['Nunito'] text-[14px] font-semibold text-[#0a0d12]">
                  {method}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className="font-['Nunito'] text-[14px] text-[#0a0d12]">
                  Price ( {itemsCount} items)
                </span>
                <span className="font-['Nunito'] text-[14px] font-semibold text-[#0a0d12]">
                  Rp{formatCurrency(items)}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className="font-['Nunito'] text-[14px] text-[#0a0d12]">
                  Delivery Fee
                </span>
                <span className="font-['Nunito'] text-[14px] font-semibold text-[#0a0d12]">
                  Rp{formatCurrency(delivery)}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className="font-['Nunito'] text-[14px] text-[#0a0d12]">
                  Service Fee
                </span>
                <span className="font-['Nunito'] text-[14px] font-semibold text-[#0a0d12]">
                  Rp{formatCurrency(service)}
                </span>
              </div>
              <div className='w-full h-px bg-[url(/images/line-payment.svg)] bg-cover bg-no-repeat my-[4px]' />
              <div className='flex justify-between items-center'>
                <span className="font-['Nunito'] text-[16px] text-[#0a0d12]">
                  Total
                </span>
                <span className="font-['Nunito'] text-[16px] font-extrabold text-[#0a0d12]">
                  Rp{formatCurrency(total)}
                </span>
              </div>
            </div>

            <button
              onClick={() => router.push('/profile')}
              className='w-full h-[48px] mt-[8px] rounded-[100px] bg-[#c12116] text-white font-semibold font-[Nunito]'
            >
              See My Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
