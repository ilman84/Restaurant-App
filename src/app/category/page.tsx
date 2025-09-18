'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
// Image imported via fallback component
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import {
  restaurantService,
  FoodyRestaurantListItem,
} from '@/services/restaurantService';
import { getRestaurantImage } from '@/lib/imageUtils';

export default function CategoryPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [restaurants, setRestaurants] = useState<FoodyRestaurantListItem[]>([]);
  const [menuThumbByRestaurantId, setMenuThumbByRestaurantId] = useState<
    Record<number, string>
  >({});

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [distanceFilter, setDistanceFilter] = useState<string>('nearby');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [ratingFilters, setRatingFilters] = useState<number[]>([]);

  const searchParams = useSearchParams();
  const query = (searchParams.get('query') || '').trim().toLowerCase();
  const tag = (searchParams.get('tag') || '').trim().toLowerCase();

  const filtered = useMemo(() => {
    let result = restaurants;

    // Apply search query filter
    if (query) {
      result = result.filter((r) =>
        [r.name, r.place].some((s) => (s || '').toLowerCase().includes(query))
      );
    }

    // Apply tag shortcuts from Home page
    if (tag) {
      switch (tag) {
        case 'nearby':
          // same as selecting 1km for a tighter nearby feel
          result = result.filter((r) => (r.id % 5) + 1 <= 1);
          break;
        case 'discount':
          // simulate discount by picking every 3rd restaurant
          result = result.filter((r) => r.id % 3 === 0);
          break;
        case 'bestseller':
          // simulate best seller by higher rating or frequently ordered lookalike
          result = result.filter((r) => r.star >= 4.5);
          break;
        case 'delivery':
          // simulate delivery-available by even ids
          result = result.filter((r) => r.id % 2 === 0);
          break;
        case 'lunch':
          // simulate lunch-friendly by id modulus
          result = result.filter((r) => r.id % 5 <= 2);
          break;
        default:
          break;
      }
    }

    // Apply distance filter (simulated - in real app would use actual coordinates)
    if (distanceFilter !== 'nearby') {
      // For demo purposes, we'll simulate distance filtering
      // In a real app, you'd calculate actual distances
      result = result.filter((r) => {
        // Simulate distance filtering based on restaurant ID
        const simulatedDistance = (r.id % 5) + 1; // 1-5 km
        switch (distanceFilter) {
          case '1km':
            return simulatedDistance <= 1;
          case '3km':
            return simulatedDistance <= 3;
          case '5km':
            return simulatedDistance <= 5;
          default:
            return true;
        }
      });
    }

    // Apply price filter
    if (minPrice || maxPrice) {
      result = result.filter((r) => {
        // Simulate price filtering based on restaurant data
        // In a real app, you'd use actual menu prices
        const simulatedPrice = (r.id % 100000) + 10000; // 10k-110k range
        const min = minPrice ? parseInt(minPrice.replace(/\D/g, '')) || 0 : 0;
        const max = maxPrice
          ? parseInt(maxPrice.replace(/\D/g, '')) || Infinity
          : Infinity;

        // Only apply filter if both values are valid numbers
        if (minPrice && isNaN(parseInt(minPrice.replace(/\D/g, ''))))
          return true;
        if (maxPrice && isNaN(parseInt(maxPrice.replace(/\D/g, ''))))
          return true;

        return simulatedPrice >= min && simulatedPrice <= max;
      });
    }

    // Apply rating filter
    if (ratingFilters.length > 0) {
      result = result.filter((r) => {
        const restaurantRating = Math.floor(r.star);
        return ratingFilters.includes(restaurantRating);
      });
    }

    return result;
  }, [
    restaurants,
    query,
    tag,
    distanceFilter,
    minPrice,
    maxPrice,
    ratingFilters,
  ]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await restaurantService.getRestaurants({
          page: 1,
          limit: 20,
        });
        if (mounted && res.success) {
          setRestaurants(res.data.restaurants || []);
        }
      } catch (e: unknown) {
        setError((e as Error).message || 'Failed to load restaurants');
      } finally {
        setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch first menu image per restaurant to ensure thumbnails match food
  useEffect(() => {
    if (!restaurants || restaurants.length === 0) return;
    let cancelled = false;
    (async () => {
      const idsToFetch = restaurants
        .map((r) => r.id)
        .filter(
          (id) => typeof id === 'number' && !(id in menuThumbByRestaurantId)
        )
        .slice(0, 20);
      if (idsToFetch.length === 0) return;
      try {
        const results = await Promise.all(
          idsToFetch.map(async (id) => {
            try {
              const resp = await restaurantService.getRestaurantById(id, {
                limitMenu: 10,
              });
              const firstMenuImg =
                resp?.data?.menus?.find((m) => !!m.image)?.image || '';
              return [id, firstMenuImg] as const;
            } catch {
              return [id, ''] as const;
            }
          })
        );
        if (cancelled) return;
        setMenuThumbByRestaurantId((prev) => {
          const next = { ...prev } as typeof prev;
          for (const [id, img] of results) {
            if (img && !(id in next)) next[id] = img;
          }
          return next;
        });
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [restaurants, menuThumbByRestaurantId]);
  return (
    <div className='w-full min-h-screen bg-[#f8f9fa] relative overflow-hidden'>
      <Navbar />

      <div className='flex justify-center items-start pt-[48px] pb-[48px] px-[16px] sm:px-[120px] w-full overflow-hidden'>
        <div className='flex w-full max-w-[1200px] flex-col gap-[32px] items-start flex-nowrap relative z-[13] mt-[48px]'>
          <div className='flex justify-between items-center w-full'>
            <div className='flex flex-col gap-[4px]'>
              <span className="h-[42px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[24px] sm:text-[32px] font-extrabold leading-[30px] sm:leading-[42px] text-[#0a0d12] relative text-left whitespace-nowrap z-[14]">
                {query ? `Search: ${query}` : 'All Restaurant'}
              </span>
              <span className="font-['Nunito'] text-[14px] text-[#717680]">
                {filtered.length} restaurant{filtered.length !== 1 ? 's' : ''}{' '}
                found
              </span>
            </div>
          </div>
          {/* Filter Text dan Hamburger Icon untuk Mobile */}
          <div className='lg:hidden flex justify-between items-center w-full'>
            <span className="h-[30px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[16px] font-extrabold leading-[30px] text-[#0a0d12] relative text-left whitespace-nowrap z-[14]">
              FILTER
            </span>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className='flex w-[15px] h-[10px] justify-center items-center shrink-0 flex-nowrap relative z-[15] hover:bg-[#f5f5f5] rounded-[8px] transition-colors cursor-pointer'
            >
              <div className='w-[15px] h-[10px] shrink-0 bg-[url(/images/hamburger-icon.png)] bg-cover bg-no-repeat relative z-[16]' />
            </button>
          </div>
          {/* Mobile Overlay */}
          {isFilterOpen && (
            <div
              className='lg:hidden fixed inset-0 bg-[#0a0d12] bg-opacity-50 z-[20]'
              onClick={() => setIsFilterOpen(false)}
            />
          )}
          <div className='flex flex-col lg:flex-row gap-[20px] lg:gap-[40px] items-start self-stretch shrink-0 flex-nowrap relative z-[15]'>
            <div
              className={`flex w-full lg:w-[266px] pt-[16px] pr-0 pb-[16px] pl-0 flex-col gap-[24px] items-start shrink-0 flex-nowrap bg-[#fff] rounded-[12px] relative shadow-[0_0_20px_0_rgba(202,201,201,0.25)] z-[21] ${
                isFilterOpen
                  ? 'fixed top-0 left-0 h-full overflow-y-auto z-[100]'
                  : 'hidden lg:flex'
              }`}
            >
              <div className='flex pt-0 pr-[16px] pb-0 pl-[16px] flex-col gap-[10px] items-start self-stretch shrink-0 flex-nowrap relative z-[17]'>
                <div className='flex justify-between items-center w-full'>
                  <span className="h-[30px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[16px] font-extrabold leading-[30px] text-[#0a0d12] relative text-left whitespace-nowrap z-[18]">
                    FILTER
                  </span>
                  {/* Close Button untuk Mobile */}
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className='lg:hidden flex w-[32px] h-[32px] justify-center items-center shrink-0 flex-nowrap relative z-[19] hover:bg-[#f5f5f5] rounded-[8px] transition-colors cursor-pointer'
                  >
                    <div className='w-[20px] h-[20px] shrink-0 bg-[url(/images/close-icon.png)] bg-cover bg-no-repeat relative z-[20]' />
                  </button>
                </div>
                <span className="h-[32px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[18px] font-extrabold leading-[32px] text-[#0a0d12] tracking-[-0.36px] relative text-left whitespace-nowrap z-[21]">
                  Distance
                </span>
                <div
                  className='flex w-[234px] gap-[8px] items-center self-stretch shrink-0 flex-nowrap relative z-20 cursor-pointer'
                  onClick={() => setDistanceFilter('nearby')}
                >
                  <div
                    className={`w-[20px] h-[20px] shrink-0 rounded-[6px] relative overflow-hidden z-[21] ${
                      distanceFilter === 'nearby'
                        ? 'bg-[#c12116]'
                        : 'border-solid border border-[#a4a7ae]'
                    }`}
                  >
                    {distanceFilter === 'nearby' && (
                      <div className='w-[14px] h-[14px] bg-[url(/images/ceklis2.svg)] bg-[length:100%_100%] bg-no-repeat relative overflow-hidden z-[22] mt-[3px] mr-0 mb-0 ml-[3px]' />
                    )}
                  </div>
                  <span className="flex w-[206px] h-[30px] justify-start items-start shrink-0 basis-auto font-['Nunito'] text-[16px] font-normal leading-[30px] text-[#0a0d12] tracking-[-0.32px] relative text-left whitespace-nowrap z-[23]">
                    Nearby
                  </span>
                </div>
                <div
                  className='flex gap-[8px] items-center self-stretch shrink-0 flex-nowrap relative z-[24] cursor-pointer'
                  onClick={() => setDistanceFilter('1km')}
                >
                  <div
                    className={`w-[20px] h-[20px] shrink-0 rounded-[6px] relative overflow-hidden z-[25] ${
                      distanceFilter === '1km'
                        ? 'bg-[#c12116]'
                        : 'border-solid border border-[#a4a7ae]'
                    }`}
                  >
                    {distanceFilter === '1km' && (
                      <div className='w-[14px] h-[14px] bg-[url(/images/ceklis2.svg)] bg-[length:100%_100%] bg-no-repeat relative overflow-hidden z-[26] mt-[3px] mr-0 mb-0 ml-[3px]' />
                    )}
                  </div>
                  <span className="h-[30px] grow shrink-0 basis-auto font-['Nunito'] text-[16px] font-normal leading-[30px] text-[#0a0d12] tracking-[-0.32px] relative text-left whitespace-nowrap z-[27]">
                    Within 1 km
                  </span>
                </div>
                <div
                  className='flex gap-[8px] items-center self-stretch shrink-0 flex-nowrap relative z-[28] cursor-pointer'
                  onClick={() => setDistanceFilter('3km')}
                >
                  <div
                    className={`w-[20px] h-[20px] shrink-0 rounded-[6px] relative overflow-hidden z-[29] ${
                      distanceFilter === '3km'
                        ? 'bg-[#c12116]'
                        : 'border-solid border border-[#a4a7ae]'
                    }`}
                  >
                    {distanceFilter === '3km' && (
                      <div className='w-[14px] h-[14px] bg-[url(/images/ceklis2.svg)] bg-[length:100%_100%] bg-no-repeat relative overflow-hidden z-[30] mt-[3px] mr-0 mb-0 ml-[3px]' />
                    )}
                  </div>
                  <span className="h-[30px] grow shrink-0 basis-auto font-['Nunito'] text-[16px] font-normal leading-[30px] text-[#0a0d12] tracking-[-0.32px] relative text-left whitespace-nowrap z-[31]">
                    Within 3 km
                  </span>
                </div>
                <div
                  className='flex gap-[8px] items-center self-stretch shrink-0 flex-nowrap relative z-32 cursor-pointer'
                  onClick={() => setDistanceFilter('5km')}
                >
                  <div
                    className={`w-[20px] h-[20px] shrink-0 rounded-[6px] relative overflow-hidden z-[33] ${
                      distanceFilter === '5km'
                        ? 'bg-[#c12116]'
                        : 'border-solid border border-[#a4a7ae]'
                    }`}
                  >
                    {distanceFilter === '5km' && (
                      <div className='w-[14px] h-[14px] bg-[url(/images/ceklis2.svg)] bg-[length:100%_100%] bg-no-repeat relative overflow-hidden z-[34] mt-[3px] mr-0 mb-0 ml-[3px]' />
                    )}
                  </div>
                  <span className="h-[30px] grow shrink-0 basis-auto font-['Nunito'] text-[16px] font-normal leading-[30px] text-[#0a0d12] tracking-[-0.32px] relative text-left whitespace-nowrap z-[35]">
                    Within 5 km
                  </span>
                </div>
              </div>
              <div className='h-px self-stretch shrink-0 bg-[url(/images/divider-line2.svg)] bg-cover bg-no-repeat relative z-[33]' />
              <div className='flex pt-0 pr-[16px] pb-0 pl-[16px] flex-col gap-[10px] items-start self-stretch shrink-0 flex-nowrap relative z-[34]'>
                <span className="h-[32px] shrink-0 basis-auto font-['Nunito'] text-[18px] font-extrabold leading-[32px] text-[#0a0d12] tracking-[-0.36px] relative text-left whitespace-nowrap z-[35]">
                  Price
                </span>
                <div className='flex pt-[8px] pr-[8px] pb-[8px] pl-[8px] gap-[8px] items-center self-stretch shrink-0 flex-nowrap rounded-[8px] border-solid border border-[#d5d7da] relative z-[36]'>
                  <div className='flex w-[38px] h-[38px] pt-[8px] pr-[8px] pb-[8px] pl-[8px] flex-col gap-[8px] justify-center items-center shrink-0 flex-nowrap bg-[#f4f4f4] rounded-[4px] relative z-[37]'>
                    <span className="h-[30px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[16px] font-bold leading-[30px] text-[#0a0d12] tracking-[-0.32px] relative text-left whitespace-nowrap z-[38]">
                      Rp
                    </span>
                  </div>
                  <input
                    type='text'
                    placeholder='Minimum Price'
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="h-[30px] grow shrink-0 basis-auto font-['Nunito'] text-[16px] font-normal leading-[30px] text-[#0a0d12] tracking-[-0.32px] relative text-left outline-none border-none bg-transparent placeholder:text-[#717680] z-[39]"
                  />
                </div>
                <div className='flex pt-[8px] pr-[8px] pb-[8px] pl-[8px] gap-[8px] items-center self-stretch shrink-0 flex-nowrap rounded-[8px] border-solid border border-[#d5d7da] relative z-40'>
                  <div className='flex w-[38px] h-[38px] pt-[8px] pr-[8px] pb-[8px] pl-[8px] flex-col gap-[8px] justify-center items-center shrink-0 flex-nowrap bg-[#f4f4f4] rounded-[4px] relative z-[41]'>
                    <span className="h-[30px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[16px] font-bold leading-[30px] text-[#0a0d12] tracking-[-0.32px] relative text-left whitespace-nowrap z-[42]">
                      Rp
                    </span>
                  </div>
                  <input
                    type='text'
                    placeholder='Maximum Price'
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="h-[30px] grow shrink-0 basis-auto font-['Nunito'] text-[16px] font-normal leading-[30px] text-[#0a0d12] tracking-[-0.32px] relative text-left outline-none border-none bg-transparent placeholder:text-[#717680] z-[43]"
                  />
                </div>
              </div>
              <div className='h-px self-stretch shrink-0 bg-[url(/images/divider-line2.svg)] bg-cover bg-no-repeat relative z-[44]' />
              <div className='flex pt-0 pr-[16px] pb-0 pl-[16px] flex-col gap-[10px] items-center self-stretch shrink-0 flex-nowrap relative z-[45]'>
                <span className="h-[32px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[18px] font-extrabold leading-[32px] text-[#0a0d12] tracking-[-0.36px] relative text-left whitespace-nowrap z-[46]">
                  Rating
                </span>
                <div className='flex flex-col items-start self-stretch shrink-0 flex-nowrap relative z-[47]'>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div
                      key={rating}
                      className='flex pt-[8px] pr-[8px] pb-[8px] pl-[8px] flex-col gap-[8px] items-start self-stretch shrink-0 flex-nowrap relative cursor-pointer'
                      onClick={() => {
                        setRatingFilters((prev) =>
                          prev.includes(rating)
                            ? prev.filter((r) => r !== rating)
                            : [...prev, rating]
                        );
                      }}
                    >
                      <div className='flex w-[64px] gap-[8px] items-center shrink-0 flex-nowrap relative'>
                        <div
                          className={`w-[20px] h-[20px] shrink-0 rounded-[6px] relative overflow-hidden ${
                            ratingFilters.includes(rating)
                              ? 'bg-[#c12116]'
                              : 'border-solid border border-[#a4a7ae]'
                          }`}
                        >
                          {ratingFilters.includes(rating) && (
                            <div className='w-[14px] h-[14px] bg-[url(/images/ceklis2.svg)] bg-[length:100%_100%] bg-no-repeat relative overflow-hidden mt-[3px] mr-0 mb-0 ml-[3px]' />
                          )}
                        </div>
                        <div className='flex w-[36px] gap-[2px] items-center shrink-0 flex-nowrap relative'>
                          <div className='w-[24px] h-[24px] shrink-0 bg-[url(/images/1star.svg)] bg-cover bg-no-repeat relative overflow-hidden' />
                          <span className="h-[30px] shrink-0 basis-auto font-['Nunito'] text-[16px] font-normal leading-[30px] text-[#0a0d12] tracking-[-0.32px] relative text-left whitespace-nowrap">
                            {rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className='flex pt-0 pr-[16px] pb-[16px] pl-[16px] flex-col gap-[10px] items-center self-stretch shrink-0 flex-nowrap relative'>
                <button
                  onClick={() => {
                    setDistanceFilter('nearby');
                    setMinPrice('');
                    setMaxPrice('');
                    setRatingFilters([]);
                  }}
                  className='w-full h-[40px] bg-[#c12116] rounded-[8px] flex items-center justify-center hover:bg-[#a01d13] transition-colors'
                >
                  <span className="font-['Nunito'] text-[16px] font-bold text-white">
                    Clear Filters
                  </span>
                </button>
              </div>
            </div>
            <div
              className={`flex flex-col gap-[20px] items-start grow shrink-0 basis-0 flex-nowrap relative z-[78] w-full ${
                isFilterOpen ? 'hidden lg:flex' : ''
              }`}
            >
              {/* API-backed Restaurant List */}
              <div className='w-full'>
                {isLoading ? (
                  <div className="text-[#0a0d12] font-['Nunito'] text-[14px]">
                    Loading restaurants...
                  </div>
                ) : error ? (
                  <div className="text-[#c12116] font-['Nunito'] text-[14px]">
                    Failed to load: {error}
                  </div>
                ) : (
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-[20px] w-full'>
                    {(filtered || []).map((r) => {
                      const displayDistance =
                        typeof r.distance === 'number'
                          ? r.distance
                          : (r.id % 5) + 1;
                      return (
                        <a
                          key={r.id}
                          href={`/detail?id=${r.id}`}
                          className='flex pt-[16px] pr-[16px] pb-[16px] pl-[16px] gap-[12px] items-center bg-[#fff] rounded-[16px] shadow-[0_0_20px_0_rgba(202,201,201,0.25)] hover:shadow-[0_0_25px_0_rgba(202,201,201,0.35)] transition-shadow'
                        >
                          <div className='w-[120px] h-[120px] shrink-0 rounded-[12px] relative overflow-hidden'>
                            <ImageWithFallback
                              src={
                                menuThumbByRestaurantId[r.id] ||
                                getRestaurantImage(r)
                              }
                              alt={r.name}
                              fill
                              className='object-cover'
                              sizes='120px'
                            />
                          </div>
                          <div className='flex flex-col gap-[2px] items-start grow'>
                            <span className="font-['Nunito'] text-[18px] font-extrabold text-[#0a0d12] whitespace-nowrap truncate w-full">
                              {r.name}
                            </span>
                            <div className='flex gap-[4px] items-center'>
                              <div className='w-[24px] h-[24px] bg-[url(/images/1star.svg)] bg-cover bg-no-repeat' />
                              <span className="font-['Nunito'] text-[16px] font-medium text-[#0a0d12]">
                                {r.star}
                              </span>
                            </div>
                            <div className='flex gap-[4px] items-center'>
                              <span className="font-['Nunito'] text-[11px] sm:text-[14px] text-[#0a0d12] whitespace-nowrap">
                                {r.place}
                              </span>
                              {Number.isFinite(displayDistance) && (
                                <>
                                  <div className='w-[2px] h-[2px] bg-[url(/images/dot.png)] bg-cover bg-no-repeat rounded-[50%]' />
                                  <span className="font-['Nunito'] text-[11px] sm:text-[14px] text-[#0a0d12] whitespace-nowrap">
                                    {displayDistance.toFixed(1)} km
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
