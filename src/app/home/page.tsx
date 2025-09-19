'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageWithInitial from '@/components/ui/ImageWithInitial';
import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import {
  restaurantService,
  FoodyRecommendationItem,
} from '@/services/restaurantService';
import { getRestaurantCardImage } from '@/lib/imageUtils';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendations, setRecommendations] = useState<
    FoodyRecommendationItem[]
  >([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(true);
  const [recError, setRecError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q.length > 0) {
      router.push(`/category?query=${encodeURIComponent(q)}`);
    } else {
      router.push('/category');
    }
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/category?tag=${encodeURIComponent(category)}`);
  };

  const handleCategoryPageClick = () => {
    router.push('/category');
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await restaurantService.getRecommended();
        if (isMounted && res.success) {
          setRecommendations(res.data.recommendations || []);
        }
      } catch (err: unknown) {
        setRecError((err as Error).message || 'Failed to load recommendations');
      } finally {
        setIsLoadingRecs(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className='w-full bg-[#fff] relative overflow-hidden'>
      {/* Hero Section dengan Background Image */}
      <div className='w-full h-[648px] sm:h-[827px] relative overflow-hidden pt-[60px] sm:pt-[80px]'>
        {/* Background Image untuk Hero Section */}
        <div className='absolute inset-0 w-full h-full bg-[url(/images/burger-home.png)] bg-cover bg-center bg-no-repeat z-2' />

        <div className='main-container w-full max-w-[1440px] h-full relative overflow-hidden mx-auto my-0 z-10'>
          {/* Navbar */}
          <Navbar />

          {/* Hero Section (judul + subjudul + search bar) */}
          <div className='flex w-full max-w-[712px] flex-col gap-[24px] sm:gap-[40px] items-center flex-nowrap relative z-20 mt-[138px] sm:mt-[246px] mb-0 mx-auto px-[16px] sm:px-0'>
            {/* Judul + Subjudul */}
            <div className='flex flex-col gap-[8px] items-center shrink-0 flex-nowrap relative z-[4]'>
              <span className="h-auto sm:h-[60px] shrink-0 basis-auto font-['Nunito'] text-[36px] sm:text-[48px] font-extrabold leading-[44px] sm:leading-[60px] text-[#fff] relative text-center z-[5]">
                <span className='sm:hidden'>
                  Explore Culinary
                  <br />
                  Experiences
                </span>
                <span className='hidden sm:inline'>
                  Explore Culinary Experiences
                </span>
              </span>
              <span className="h-auto sm:h-[36px] shrink-0 basis-auto font-['Nunito'] text-[18px] sm:text-[24px] font-bold leading-[32px] sm:leading-[36px] text-[#fff] relative text-center z-[6]">
                Search and refine your choice to discover the perfect
                restaurant.
              </span>
            </div>

            {/* Search bar */}
            <form
              onSubmit={handleSearch}
              className='flex w-full max-w-[349px] sm:max-w-[604px] h-[48px] sm:h-[56px] pt-[8px] pr-[16px] sm:pr-[24px] pb-[8px] pl-[16px] sm:pl-[24px] gap-[6px] items-center shrink-0 flex-nowrap bg-[#fff] rounded-full relative z-[1]'
            >
              <div className='w-[16px] h-[16px] sm:w-[20px] sm:h-[20px] shrink-0 bg-[url(/images/search-icon.svg)] bg-cover bg-no-repeat relative overflow-hidden z-[8]' />
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search restaurants, food and drink'
                className="h-[24px] sm:h-[30px] shrink-0 basis-auto font-['Nunito'] text-[14px] sm:text-[16px] font-normal leading-[24px] sm:leading-[30px] text-[#535861] tracking-[-0.32px] relative text-left flex-1 outline-none bg-transparent z-[9]"
              />
            </form>
          </div>
        </div>
      </div>

      {/* Section kategori pilihan (All Restaurant, Nearby, Discount, Best Seller, Delivery, Lunch) */}
      <div className='w-full bg-[#fff]'>
        <div className='grid grid-cols-3 sm:flex w-full max-w=[1200px] gap-[16px] sm:gap-0 sm:justify-between items-center flex-nowrap relative z-[1] mt-[24px] sm:mt-[40px] mb-0 mx-auto px-[16px] sm:px-[120px]'>
          {/* Item kategori All Restaurant */}
          <button
            onClick={handleCategoryPageClick}
            className='flex w-full sm:w-[161px] flex-col gap-[6px] justify-center items-center shrink-0 flex-nowrap relative z-[1] hover:scale-105 transition-transform'
          >
            <div className='flex h-[80px] sm:h-[100px] p-[8px] gap-[8px] justify-center items-center w-full sm:self-stretch shrink-0 flex-nowrap bg-[#fff] rounded-[16px] shadow-[0_0_20px_0_rgba(202,201,201,0.25)] relative z-[1]'>
              <div className='w-[50px] h-[50px] sm:w-[65px] sm:h-[65px] shrink-0 relative z-[1]'>
                <div className='w-full h-full bg-[url(/images/all-restaurant-icon.png)] bg-cover bg-no-repeat absolute top-0 left-0 z-[1]' />
              </div>
            </div>
            <span className="h-[24px] sm:h-[32px] w-full sm:self-stretch font-['Nunito'] text-[14px] sm:text-[18px] font-bold leading-[24px] sm:leading-[32px] text-[#0a0d12] tracking-[-0.42px] sm:tracking-[-0.54px] text-center whitespace-nowrap z-[1]">
              All Restaurant
            </span>
          </button>

          {/* Item Nearby */}
          <button
            onClick={() => handleCategoryClick('nearby')}
            className='flex w-full sm:w-[161px] flex-col gap-[6px] justify-center items-center shrink-0 flex-nowrap relative z-[1] hover:scale-105 transition-transform'
          >
            <div className='flex h-[80px] sm:h-[100px] p-[8px] justify-center items-center w-full bg-[#fff] rounded-[16px] shadow-[0_0_20px_0_rgba(202,201,201,0.25)] relative z-[1]'>
              <div className='w-[50px] h-[50px] sm:w-[65px] sm:h-[65px] shrink-0 relative z-[1]'>
                <div className='w-full h-full bg-[url(/images/nearby-icon.png)] bg-cover bg-no-repeat absolute top-0 left-0 z-[1]' />
              </div>
            </div>
            <span className="h-[24px] sm:h-[32px] w-full text-[14px] sm:text-[18px] font-bold text-[#0a0d12] font-['Nunito'] text-center">
              Nearby
            </span>
          </button>

          {/* Item Discount */}
          <button
            onClick={() => handleCategoryClick('discount')}
            className='flex w-full sm:w-[161px] flex-col gap-[6px] justify-center items-center shrink-0 relative hover:scale-105 transition-transform'
          >
            <div className='flex h-[80px] sm:h-[100px] p-[8px] justify-center items-center w-full bg-[#fff] rounded-[16px] shadow-[0_0_20px_0_rgba(202,201,201,0.25)]'>
              <div className='w-[50px] h-[50px] sm:w-[65px] sm:h-[65px]'>
                <div className='w-full h-full bg-[url(/images/discount-icon.png)] bg-cover bg-no-repeat' />
              </div>
            </div>
            <span className="text-[14px] sm:text-[18px] font-bold text-[#0a0d12] font-['Nunito'] text-center w-full">
              Discount
            </span>
          </button>

          {/* Item Best Seller */}
          <button
            onClick={() => handleCategoryClick('bestseller')}
            className='flex w-full sm:w-[161px] flex-col gap-[6px] justify-center items-center shrink-0 relative hover:scale-105 transition-transform'
          >
            <div className='flex h-[80px] sm:h-[100px] p-[8px] justify-center items-center w-full bg-[#fff] rounded-[16px] shadow-[0_0_20px_0_rgba(202,201,201,0.25)]'>
              <div className='w-[50px] h-[50px] sm:w-[65px] sm:h-[65px]'>
                <div className='w-full h-full bg-[url(/images/best-seller-icon.png)] bg-cover bg-no-repeat' />
              </div>
            </div>
            <span className="text-[14px] sm:text-[18px] font-bold text-[#0a0d12] font-['Nunito'] text-center w-full">
              Best Seller
            </span>
          </button>

          {/* Item Delivery */}
          <button
            onClick={() => handleCategoryClick('delivery')}
            className='flex w-full sm:w-[161px] flex-col gap-[6px] justify-center items-center shrink-0 relative hover:scale-105 transition-transform'
          >
            <div className='flex h-[80px] sm:h-[100px] p-[8px] justify-center items-center w-full bg-[#fff] rounded-[16px] shadow-[0_0_20px_0_rgba(202,201,201,0.25)]'>
              <div className='w-[50px] h-[50px] sm:w-[65px] sm:h-[65px]'>
                <div className='w-full h-full bg-[url(/images/delivery-icon.png)] bg-cover bg-no-repeat' />
              </div>
            </div>
            <span className="text-[14px] sm:text-[18px] font-bold text-[#0a0d12] font-['Nunito'] text-center w-full">
              Delivery
            </span>
          </button>

          {/* Item Lunch */}
          <button
            onClick={() => handleCategoryClick('lunch')}
            className='flex w-full sm:w-[161px] flex-col gap-[6px] justify-center items-center shrink-0 relative hover:scale-105 transition-transform'
          >
            <div className='flex h-[80px] sm:h-[100px] p-[8px] justify-center items-center w-full bg-[#fff] rounded-[16px] shadow-[0_0_20px_0_rgba(202,201,201,0.25)]'>
              <div className='w-[50px] h-[50px] sm:w-[65px] sm:h-[65px]'>
                <div className='w-full h-full bg-[url(/images/lunch-icon.png)] bg-cover bg-no-repeat' />
              </div>
            </div>
            <span className="text-[14px] sm:text-[18px] font-bold text-[#0a0d12] font-['Nunito'] text-center w-full">
              Lunch
            </span>
          </button>
        </div>
      </div>

      {/* Section Recommended */}
      <div className='w-full bg-[#fff]'>
        <div className='flex w-full max-w-[1200px] flex-col gap-[24px] sm:gap-[32px] justify-center items-center flex-nowrap relative z-[1] mt-[32px] sm:mt-[48px] mx-auto px-[16px] sm:px-[120px]'>
          <div className='flex justify-between items-center w-full'>
            <span className="h-[32px] sm:h-[42px] text-[24px] sm:text-[32px] font-extrabold text-[#0a0d12] font-['Nunito']">
              Recommended
            </span>
            <button
              onClick={handleCategoryPageClick}
              className="w-[80px] sm:w-[206px] h-[24px] sm:h-[32px] text-[14px] sm:text-[18px] font-extrabold text-[#c12116] text-right hover:text-[#a01a12] transition-colors font-['Nunito'] cursor-pointer"
            >
              See All
            </button>
          </div>

          {/* API-backed Recommended List */}
          <div className='w-full'>
            {isLoadingRecs ? (
              <div className="text-[#0a0d12] font-['Nunito'] text-[14px]">
                Loading recommendations...
              </div>
            ) : recError ? (
              <div className="text-[#c12116] font-['Nunito'] text-[14px]">
                Failed to load: {recError}
              </div>
            ) : (
              <>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-[12px] sm:gap-[20px] justify-center place-items-center mx-auto'>
                  {recommendations.slice(0, visibleCount).map((item) => {
                    const safe = getRestaurantCardImage(item);
                    const displayDistance =
                      typeof item.distance === 'number'
                        ? item.distance
                        : (item.id % 5) + 1;
                    return (
                      <div
                        key={item.id}
                        className='flex w-full max-w-[360px] p-[12px] sm:p-[16px] gap-[12px] items-center sm:items-center sm:justify-center bg-[#fff] rounded-[16px] shadow-[0_0_20px_0_rgba(202,201,201,0.25)] hover:shadow-[0_0_25px_0_rgba(202,201,201,0.35)] transition-shadow cursor-pointer mx-auto'
                        onClick={() => router.push(`/detail?id=${item.id}`)}
                      >
                        <div className='w-[80px] h-[80px] sm:w-[120px] sm:h-[120px] shrink-0 rounded-[12px] relative overflow-hidden'>
                          <ImageWithInitial
                            src={safe}
                            alt={item.name}
                            fallbackText={item.name}
                            fill
                            className='object-cover'
                            sizes='(max-width: 768px) 80px, 120px'
                          />
                        </div>
                        <div className='flex flex-col gap-[2px] items-start grow'>
                          <span className="font-['Nunito'] text-[16px] sm:text-[18px] font-extrabold text-[#0a0d12] whitespace-nowrap truncate w-full text-left">
                            {item.name}
                          </span>
                          <div className='flex gap-[4px] items-center'>
                            <div className='w-[16px] h-[16px] sm:w-[24px] sm:h-[24px] bg-[url(/images/star.png)] bg-cover bg-no-repeat' />
                            <span className="font-['Nunito'] text-[14px] sm:text-[16px] font-medium text-[#0a0d12]">
                              {item.star}
                            </span>
                          </div>
                          <div className='flex gap-[4px] items-center'>
                            <span className="font-['Nunito'] text-[11px] sm:text-[14px] text-[#0a0d12] text-left whitespace-nowrap">
                              {item.place}
                            </span>
                            {Number.isFinite(displayDistance) && (
                              <>
                                <div className='w-[2px] h-[2px] bg-[url(/images/dot.png)] bg-cover bg-no-repeat rounded-[50%]' />
                                <span className="font-['Nunito'] text-[11px] sm:text-[14px] text-[#0a0d12] text-left whitespace-nowrap">
                                  {displayDistance.toFixed(1)} km
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className='flex justify-center items-center w-full mt-[16px]'>
                  {recommendations.length > visibleCount ? (
                    <button
                      onClick={() => setVisibleCount((c) => c + 6)}
                      className='flex w-[120px] h-[40px] pt-[6px] pr-[6px] pb-[6px] pl-[6px] gap-[6px] justify-center items-center shrink-0 flex-nowrap rounded-[100px] border-solid border border-[#d5d7da] relative hover:bg-[#f5f5f5] transition-colors cursor-pointer'
                    >
                      <span className="h-[24px] shrink-0 basis-auto font-['Nunito'] text-[14px] font-bold leading-[24px] text-[#0a0d12] tracking-[-0.28px] relative text-left whitespace-nowrap">
                        Show More
                      </span>
                    </button>
                  ) : (
                    recommendations.length > 6 && (
                      <button
                        onClick={() => setVisibleCount(6)}
                        className='flex w-[120px] h-[40px] pt-[6px] pr-[6px] pb-[6px] pl-[6px] gap-[6px] justify-center items-center shrink-0 flex-nowrap rounded-[100px] border-solid border border-[#d5d7da] relative hover:bg-[#f5f5f5] transition-colors cursor-pointer'
                      >
                        <span className="h-[24px] shrink-0 basis-auto font-['Nunito'] text-[14px] font-bold leading-[24px] text-[#0a0d12] tracking-[-0.28px] relative text-left whitespace-nowrap">
                          Show Less
                        </span>
                      </button>
                    )
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
