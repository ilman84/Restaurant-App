'use client';

import { useRouter } from 'next/navigation';

export default function Footer() {
  const router = useRouter();
  return (
    <div className='flex flex-col sm:flex-row w-full max-w-[1440px] pt-[40px] sm:pt-[80px] pr-[16px] sm:pr-[120px] pb-[40px] sm:pb-[80px] pl-[16px] sm:pl-[120px] gap-[32px] sm:gap-0 sm:justify-between items-start flex-nowrap bg-[#0a0d12] border-solid border-b border-b-[#d5d7da] relative z-[1] mt-[100px] mx-auto'>
      {/* Brand and Description Section */}
      <div className='flex w-full sm:w-[380px] flex-col gap-[24px] sm:gap-[40px] items-start shrink-0 flex-nowrap relative z-[1]'>
        <div className='flex flex-col gap-[16px] sm:gap-[22px] items-start w-full shrink-0 flex-nowrap relative z-[1]'>
          <div className='flex w-[149px] gap-[15px] items-center shrink-0 flex-nowrap relative z-[1]'>
            <div className='w-[32px] h-[32px] sm:w-[42px] sm:h-[42px] shrink-0 relative overflow-hidden z-[1]'>
              <div className='w-full h-full bg-[url(/images/foody-icon.svg)] bg-[length:100%_100%] bg-no-repeat absolute top-0 left-0 z-[1]' />
            </div>
            <span className="h-[32px] sm:h-[42px] shrink-0 basis-auto font-['Nunito'] text-[24px] sm:text-[32px] font-extrabold leading-[32px] sm:leading-[42px] text-[#fff] relative text-left whitespace-nowrap z-[1]">
              Foody
            </span>
          </div>
          <span className="flex w-full sm:w-[380px] h-auto sm:h-[90px] justify-start items-start shrink-0 font-['Nunito'] text-[14px] sm:text-[16px] font-normal leading-[22px] sm:leading-[30px] text-[#fdfdfd] tracking-[-0.28px] sm:tracking-[-0.32px] relative text-left z-[1]">
            Enjoy homemade flavors & chef&apos;s signature dishes, freshly
            prepared every day. Order online or visit our nearest branch.
          </span>
        </div>
        <div className='flex w-full sm:w-[196px] flex-col gap-[16px] sm:gap-[20px] justify-center items-start shrink-0 flex-nowrap relative z-[1]'>
          <div className='flex gap-[8px] items-center w-full shrink-0 flex-nowrap relative z-[1]'>
            <span className="flex w-auto h-[24px] sm:h-[30px] justify-start items-start shrink-0 basis-auto font-['Nunito'] text-[14px] sm:text-[16px] font-extrabold leading-[24px] sm:leading-[30px] text-[#fdfdfd] relative text-left whitespace-nowrap z-[1]">
              Follow on Social Media
            </span>
          </div>
          <div className='flex gap-[12px] items-center w-full shrink-0 flex-nowrap relative z-[1]'>
            <div className='w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] shrink-0 bg-[url(/images/fb-icon.svg)] bg-cover bg-no-repeat rounded-full relative z-[1]' />
            <div className='w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] shrink-0 bg-[url(/images/ig-icon.svg)] bg-cover bg-no-repeat rounded-full relative z-[1]' />
            <div className='w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] shrink-0 bg-[url(/images/linkedin-icon.svg)] bg-cover bg-no-repeat rounded-full relative z-[1]' />
            <div className='w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] shrink-0 bg-[url(/images/tiktok-icon.svg)] bg-cover bg-no-repeat rounded-full relative z-[1]' />
          </div>
        </div>
      </div>

      {/* Navigation Sections Container - Mobile: side by side, Desktop: horizontal */}
      <div className='flex flex-row w-full gap-[24px] sm:gap-[80px] items-start shrink-0 flex-nowrap relative z-[1] sm:ml-[140px]'>
        {/* Explore Section */}
        <div className='flex w-1/2 sm:w-[200px] flex-col gap-[16px] sm:gap-[20px] items-start shrink-0 flex-nowrap relative z-[1]'>
          <div className='flex gap-[8px] items-center w-full shrink-0 flex-nowrap bg-[#0a0d12] relative z-[1]'>
            <span className="flex w-auto h-[24px] sm:h-[30px] justify-start items-start shrink-0 basis-auto font-['Nunito'] text-[14px] sm:text-[16px] font-extrabold leading-[24px] sm:leading-[30px] text-[#fdfdfd] relative text-left whitespace-nowrap z-[1]">
              Explore
            </span>
          </div>
          <div className='flex flex-col gap-[12px] sm:gap-[8px] items-start w-full shrink-0 flex-nowrap relative z-[1]'>
            <button
              onClick={() => router.push('/category')}
              className="text-left font-['Nunito'] text-[14px] sm:text-[16px] leading-[20px] sm:leading-[30px] text-[#fdfdfd] hover:opacity-80"
            >
              All Food
            </button>
            <button
              onClick={() => router.push('/category?tag=nearby')}
              className="text-left font-['Nunito'] text-[14px] sm:text-[16px] leading-[20px] sm:leading-[30px] text-[#fdfdfd] hover:opacity-80"
            >
              Nearby
            </button>
            <button
              onClick={() => router.push('/category?tag=discount')}
              className="text-left font-['Nunito'] text-[14px] sm:text-[16px] leading-[20px] sm:leading-[30px] text-[#fdfdfd] hover:opacity-80"
            >
              Discount
            </button>
            <button
              onClick={() => router.push('/category?tag=bestseller')}
              className="text-left font-['Nunito'] text-[14px] sm:text-[16px] leading-[20px] sm:leading-[30px] text-[#fdfdfd] hover:opacity-80"
            >
              Best Seller
            </button>
            <button
              onClick={() => router.push('/category?tag=delivery')}
              className="text-left font-['Nunito'] text-[14px] sm:text-[16px] leading-[20px] sm:leading-[30px] text-[#fdfdfd] hover:opacity-80"
            >
              Delivery
            </button>
            <button
              onClick={() => router.push('/category?tag=lunch')}
              className="text-left font-['Nunito'] text-[14px] sm:text-[16px] leading-[20px] sm:leading-[30px] text-[#fdfdfd] hover:opacity-80"
            >
              Lunch
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className='flex w-1/2 sm:w-[200px] flex-col gap-[16px] sm:gap-[20px] items-start shrink-0 flex-nowrap relative z-[1]'>
          <div className='flex gap-[8px] items-center w-full shrink-0 flex-nowrap bg-[#0a0d12] relative z-[1]'>
            <span className="flex w-auto h-[24px] sm:h-[30px] justify-start items-start shrink-0 basis-auto font-['Nunito'] text-[14px] sm:text-[16px] font-extrabold leading-[24px] sm:leading-[30px] text-[#fdfdfd] relative text-left whitespace-nowrap z-[1]">
              Help
            </span>
          </div>
          <div className='flex flex-col gap-[12px] sm:gap-[8px] items-start w-full shrink-0 flex-nowrap relative z-[1]'>
            <button
              onClick={() => router.push('/checkout')}
              className="text-left font-['Nunito'] text-[14px] sm:text-[16px] leading-[20px] sm:leading-[30px] text-[#fdfdfd] hover:opacity-80"
            >
              How to Order
            </button>
            <button
              onClick={() => router.push('/checkout')}
              className="text-left font-['Nunito'] text-[14px] sm:text-[16px] leading-[20px] sm:leading-[30px] text-[#fdfdfd] hover:opacity-80"
            >
              Payment Methods
            </button>
            <button
              onClick={() => router.push('/profile?tab=orders')}
              className="text-left font-['Nunito'] text-[14px] sm:text-[16px] leading-[20px] sm:leading-[30px] text-[#fdfdfd] hover:opacity-80"
            >
              Track My Order
            </button>
            <button
              onClick={() => router.push('/home')}
              className="text-left font-['Nunito'] text-[14px] sm:text-[16px] leading-[20px] sm:leading-[30px] text-[#fdfdfd] hover:opacity-80"
            >
              FAQ
            </button>
            <a
              href='zaid.2010@yahoo.com'
              className="text-left font-['Nunito'] text-[14px] sm:text-[16px] leading-[20px] sm:leading-[30px] text-[#fdfdfd] hover:opacity-80"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
