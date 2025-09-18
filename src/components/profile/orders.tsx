import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { orderService } from '@/services/orderService';
import { restaurantService } from '@/services/restaurantService';
import { formatRupiah } from '@/lib/utils';
import { getRestaurantImage } from '@/lib/imageUtils';

type UiOrder = {
  id?: number;
  transactionId?: string;
  status?: string;
  paymentMethod?: string;
  pricing?: {
    subtotal: number;
    serviceFee: number;
    deliveryFee: number;
    totalPrice: number;
  };
  restaurants?: Array<{
    restaurantId?: number;
    restaurantName?: string;
    restaurantLogo?: string;
    items: Array<{
      menuId: number;
      menuName: string;
      price: number;
      quantity: number;
      itemTotal: number;
    }>;
    subtotal: number;
  }>;
  createdAt?: string;
};

export default function Orders() {
  const [orders, setOrders] = useState<UiOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoByRestaurantId, setLogoByRestaurantId] = useState<
    Record<number, string>
  >({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await orderService.getUserOrders(1, 10);
        if (mounted && res.success) {
          setOrders(res.data.orders || []);
        }
      } catch (e: unknown) {
        setError((e as Error).message || 'Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Lazy fetch restaurant logos when missing in order payload
  useEffect(() => {
    const uniqueIds = new Set<number>();
    orders.forEach((o) => {
      const rid = o.restaurants?.[0]?.restaurantId;
      if (typeof rid === 'number' && !(rid in logoByRestaurantId)) {
        uniqueIds.add(rid);
      }
    });
    if (uniqueIds.size === 0) return;

    let cancelled = false;
    (async () => {
      try {
        const entries = await Promise.all(
          Array.from(uniqueIds).map(async (rid) => {
            try {
              const resp = await restaurantService.getRestaurantById(rid);
              const logo = resp?.data?.logo || '';
              return [rid, logo] as const;
            } catch {
              return [rid, ''] as const;
            }
          })
        );
        if (!cancelled) {
          setLogoByRestaurantId((prev) => {
            const next = { ...prev };
            for (const [rid, logo] of entries) {
              if (logo && !(rid in next)) next[rid] = logo;
            }
            return next;
          });
        }
      } catch {
        // ignore
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [orders, logoByRestaurantId]);
  return (
    <div className='main-container flex w-full sm:w-[800px] flex-col gap-[24px] items-start flex-nowrap relative mx-auto my-0'>
      <span className="h-[42px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[24px] sm:text-[32px] font-extrabold leading-[42px] text-[#0a0d12] relative text-left whitespace-nowrap">
        My Orders
      </span>
      {isLoading && (
        <div className="text-[#0a0d12] font-['Nunito'] text-[14px]">
          Loading orders...
        </div>
      )}
      {error && !isLoading && (
        <div className="text-[#c12116] font-['Nunito'] text-[14px]">
          {error}
        </div>
      )}
      <div className='flex pt-[24px] pr-[24px] pb-[24px] pl-[24px] flex-col gap-[20px] items-start self-stretch shrink-0 flex-nowrap bg-[#fff] rounded-[16px] relative z-[1]'>
        <div className='flex w-full sm:w-[598px] h-[44px] pt-[8px] pr-[16px] pb-[8px] pl-[16px] gap-[6px] items-center shrink-0 flex-nowrap bg-[#fff] rounded-full border-solid border border-[#d5d7da] relative z-[2]'>
          <div className='w-[20px] h-[20px] shrink-0 bg-[url(/images/search-icon.svg)] bg-cover bg-no-repeat relative overflow-hidden z-[3]' />
          <span className="h-[28px] shrink-0 basis-auto font-['Nunito'] text-[14px] font-normal leading-[28px] text-[#535861] tracking-[-0.28px] relative text-left whitespace-nowrap z-[4]">
            Search
          </span>
        </div>
        <div className='flex w-full sm:w-[598px] gap-[8px] sm:gap-[12px] items-center self-stretch shrink-0 flex-nowrap relative z-[5] overflow-x-auto'>
          <span className="h-[32px] shrink-0 basis-auto font-['Nunito'] text-[16px] sm:text-[18px] font-bold leading-[32px] text-[#0a0d12] tracking-[-0.54px] relative text-left whitespace-nowrap z-[6]">
            Status
          </span>
          <div className='flex w-[80px] sm:w-[101px] pt-[8px] pr-[12px] sm:pr-[16px] pb-[8px] pl-[12px] sm:pl-[16px] gap-[8px] justify-center items-center shrink-0 flex-nowrap rounded-[100px] border-solid border border-[#d5d7da] relative z-[7]'>
            <span className="h-[30px] shrink-0 basis-auto font-['Nunito'] text-[12px] sm:text-[16px] font-semibold leading-[30px] text-[#0a0d12] tracking-[-0.32px] relative text-left whitespace-nowrap z-[8]">
              Preparing
            </span>
          </div>
          <div className='flex w-[90px] sm:w-[117px] pt-[8px] pr-[12px] sm:pr-[16px] pb-[8px] pl-[12px] sm:pl-[16px] gap-[8px] justify-center items-center shrink-0 flex-nowrap rounded-[100px] border-solid border border-[#d5d7da] relative z-[9]'>
            <span className="h-[30px] shrink-0 basis-auto font-['Nunito'] text-[12px] sm:text-[16px] font-semibold leading-[30px] text-[#0a0d12] tracking-[-0.32px] relative text-left whitespace-nowrap z-10">
              On the Way
            </span>
          </div>
          <div className='flex w-[80px] sm:w-[100px] pt-[8px] pr-[12px] sm:pr-[16px] pb-[8px] pl-[12px] sm:pl-[16px] gap-[8px] justify-center items-center shrink-0 flex-nowrap rounded-[100px] border-solid border border-[#d5d7da] relative z-[11]'>
            <span className="h-[30px] shrink-0 basis-auto font-['Nunito'] text-[12px] sm:text-[16px] font-semibold leading-[30px] text-[#0a0d12] tracking-[-0.32px] relative text-left whitespace-nowrap z-[12]">
              Delivered
            </span>
          </div>
          <div className='flex w-[60px] sm:w-[71px] pt-[8px] pr-[12px] sm:pr-[16px] pb-[8px] pl-[12px] sm:pl-[16px] gap-[8px] justify-center items-center shrink-0 flex-nowrap bg-[#ffecec] rounded-[100px] border-solid border border-[#c12116] relative z-[13]'>
            <span className="h-[30px] shrink-0 basis-auto font-['Nunito'] text-[12px] sm:text-[16px] font-bold leading-[30px] text-[#c12116] tracking-[-0.32px] relative text-left whitespace-nowrap z-[14]">
              Done
            </span>
          </div>
          <div className='flex w-[80px] sm:w-[97px] pt-[8px] pr-[12px] sm:pr-[16px] pb-[8px] pl-[12px] sm:pl-[16px] gap-[8px] justify-center items-center shrink-0 flex-nowrap rounded-[100px] border-solid border border-[#d5d7da] relative z-[15]'>
            <span className="h-[30px] shrink-0 basis-auto font-['Nunito'] text-[12px] sm:text-[16px] font-semibold leading-[30px] text-[#0a0d12] tracking-[-0.32px] relative text-left whitespace-nowrap z-[16]">
              Canceled
            </span>
          </div>
        </div>
        {(orders.length ? orders : [null]).map((o, idx) => (
          <div
            key={idx}
            className='flex pt-[20px] pr-[20px] pb-[20px] pl-[20px] flex-col gap-[16px] items-start self-stretch shrink-0 flex-nowrap bg-[#fff] rounded-[16px] relative shadow-[0_0_20px_0_rgba(202,201,201,0.25)] z-[17]'
          >
            <div className='flex w-full sm:w-[136px] gap-[8px] items-center shrink-0 flex-nowrap relative z-[18]'>
              <div className='w-[32px] h-[32px] shrink-0 bg-[url(/images/orders-icon.svg)] bg-cover bg-no-repeat relative z-[19]' />
              <span className="h-[32px] shrink-0 basis-auto font-['Nunito'] text-[16px] sm:text-[18px] font-bold leading-[32px] text-[#0a0d12] tracking-[-0.54px] relative text-left whitespace-nowrap z-20">
                {o ? `#${o.transactionId}` : 'No Orders'}
              </span>
            </div>
            <div className='flex justify-between items-center self-stretch shrink-0 flex-nowrap relative z-[21]'>
              <div className='flex gap-[12px] sm:gap-[17px] items-center grow shrink-0 basis-0 flex-nowrap relative z-[22]'>
                <div className='w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] shrink-0 rounded-[12px] relative z-[23] overflow-hidden'>
                  <Image
                    src={(() => {
                      const rid = o?.restaurants?.[0]?.restaurantId;
                      const provided = o?.restaurants?.[0]?.restaurantLogo;
                      if (provided)
                        return getRestaurantImage({ logo: provided });
                      if (typeof rid === 'number' && logoByRestaurantId[rid]) {
                        return getRestaurantImage({
                          logo: logoByRestaurantId[rid],
                        });
                      }
                      return '/images/burger-king-icon.png';
                    })()}
                    alt={o?.restaurants?.[0]?.restaurantName || 'Restaurant'}
                    fill
                    className='object-cover'
                    sizes='(max-width: 768px) 60px, 80px'
                  />
                </div>
                <div className='flex flex-col items-start grow shrink-0 basis-0 flex-nowrap relative z-[24]'>
                  <span className="h-[30px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[14px] sm:text-[16px] font-bold leading-[30px] text-[#0a0d12] tracking-[-0.48px] relative text-left whitespace-nowrap z-[25]">
                    {o?.restaurants?.[0]?.restaurantName || 'Restaurant'}
                  </span>
                  {o && (o.status || '').toLowerCase() !== 'preparing' && (
                    <span className="h-[30px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[12px] sm:text-[14px] font-medium leading-[30px] text-[#535861] tracking-[-0.28px] relative text-left whitespace-nowrap z-[26]">
                      {o.status}
                    </span>
                  )}
                </div>
              </div>
              <div className='flex w-[100px] sm:w-[273.5px] h-[88px] pt-0 pr-0 pb-0 pl-0 gap-[16px] justify-end items-center shrink-0 flex-nowrap relative z-[27]' />
            </div>
            {/* Food Items Section */}
            {o?.restaurants?.[0]?.items &&
              o.restaurants[0].items.length > 0 && (
                <div className='flex flex-col gap-[12px] self-stretch shrink-0 flex-nowrap relative z-[27.5]'>
                  <span className="h-[24px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[14px] sm:text-[16px] font-bold leading-[24px] text-[#0a0d12] tracking-[-0.28px] relative text-left whitespace-nowrap z-[27.6]">
                    Order Items
                  </span>
                  <div className='flex flex-col gap-[12px] self-stretch shrink-0 flex-nowrap relative z-[27.7]'>
                    {o.restaurants[0].items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className='flex justify-between items-start self-stretch shrink-0 flex-nowrap relative z-[27.8] p-[12px] bg-[#f8f9fa] rounded-[8px]'
                      >
                        <div className='flex flex-col items-start grow shrink-0 basis-0 flex-nowrap relative z-[27.9] gap-[4px]'>
                          <span className="h-[20px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[13px] sm:text-[14px] font-semibold leading-[20px] text-[#0a0d12] tracking-[-0.24px] relative text-left whitespace-nowrap z-[28.0]">
                            {item.menuName}
                          </span>
                          <span className="h-[18px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[11px] sm:text-[12px] font-normal leading-[18px] text-[#535861] tracking-[-0.22px] relative text-left whitespace-nowrap z-[28.1]">
                            Quantity: {item.quantity}
                          </span>
                        </div>
                        <div className='flex flex-col items-end shrink-0 flex-nowrap relative z-[28.2] gap-[4px]'>
                          <span className="h-[20px] shrink-0 basis-auto font-['Nunito'] text-[12px] sm:text-[14px] font-bold leading-[20px] text-[#0a0d12] tracking-[-0.24px] relative text-left whitespace-nowrap z-[28.3]">
                            {formatRupiah(item.price)} each
                          </span>
                          <span className="h-[18px] shrink-0 basis-auto font-['Nunito'] text-[13px] sm:text-[14px] font-extrabold leading-[18px] text-[#c12116] tracking-[-0.22px] relative text-left whitespace-nowrap z-[28.4]">
                            {formatRupiah(item.itemTotal)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            <div className='h-px self-stretch shrink-0 bg-[url(/images/line-order.svg)] bg-cover bg-no-repeat relative z-[28]' />
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center self-stretch shrink-0 flex-nowrap relative z-[29] gap-4'>
              <div className='flex w-full sm:w-[223px] flex-col gap-[-4px] items-start shrink-0 flex-nowrap relative z-30'>
                <span className="h-[30px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[14px] sm:text-[16px] font-medium leading-[30px] text-[#0a0d12] tracking-[-0.48px] relative text-left whitespace-nowrap z-[31]">
                  Total
                </span>
                <span className="h-[34px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[18px] sm:text-[20px] font-extrabold leading-[34px] text-[#0a0d12] relative text-left whitespace-nowrap z-[32]">
                  {o?.pricing ? formatRupiah(o.pricing.totalPrice) : '-'}
                </span>
              </div>
              <a
                href={
                  o
                    ? `/review?transactionId=${encodeURIComponent(
                        o.transactionId || ''
                      )}&restaurantId=${encodeURIComponent(
                        String(o.restaurants?.[0]?.restaurantId ?? '')
                      )}`
                    : '/review'
                }
                className='flex w-full sm:w-[240px] h-[48px] pt-[8px] pr-[8px] pb-[8px] pl-[8px] gap-[8px] justify-center items-center shrink-0 flex-nowrap bg-[#c12116] rounded-[200px] relative z-[33]'
              >
                <span className="h-[30px] shrink-0 basis-auto font-['Nunito'] text-[14px] sm:text-[16px] font-bold leading-[30px] text-[#fdfdfd] tracking-[-0.32px] relative text-left whitespace-nowrap z-[34]">
                  Give Review
                </span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
