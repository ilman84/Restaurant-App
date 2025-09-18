'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { authService, User } from '@/services/auth';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchCart, resetCart } from '@/store/slices/cartSlice';

export default function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { count: cartCount } = useAppSelector((state) => state.cart);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfilePage, setIsProfilePage] = useState(false);
  const [isDetailPage, setIsDetailPage] = useState(false);
  const [isCategoryPage, setIsCategoryPage] = useState(false);
  const [isCartPage, setIsCartPage] = useState(false);
  const [isCheckoutPage, setIsCheckoutPage] = useState(false);
  const [isReviewPage, setIsReviewPage] = useState(false);

  // Check login status on component mount
  useEffect(() => {
    const { user, token } = authService.getAuthData();
    if (user && token) {
      setIsLoggedIn(true);
      setUserData(user);
      // Fetch cart when user is logged in
      dispatch(fetchCart());
    } else {
      // Reset cart when user is not logged in
      dispatch(resetCart());
    }
  }, [dispatch]);

  // Check current page
  useEffect(() => {
    setIsProfilePage(window.location.pathname === '/profile');
    setIsDetailPage(window.location.pathname === '/detail');
    setIsCategoryPage(window.location.pathname === '/category');
    setIsCartPage(window.location.pathname === '/cart');
    setIsCheckoutPage(window.location.pathname === '/checkout');
    setIsReviewPage(window.location.pathname === '/review');
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignIn = () => {
    router.push('/login');
  };

  const handleSignUp = () => {
    router.push('/register');
  };

  const handleLogout = () => {
    authService.clearAuthData();
    setIsLoggedIn(false);
    setUserData(null);
    // Reset cart when user logs out
    dispatch(resetCart());
  };

  const handleCartClick = () => {
    router.push('/cart');
  };

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const handleLogoClick = () => {
    router.push('/home');
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 flex w-full h-[60px] sm:h-[80px] pt-0 px-[16px] sm:px-[120px] justify-between items-center flex-nowrap transition-all duration-300 ${
        isScrolled ||
        isProfilePage ||
        isDetailPage ||
        isCategoryPage ||
        isCartPage ||
        isCheckoutPage ||
        isReviewPage ||
        isReviewPage
          ? 'bg-white shadow-lg'
          : 'bg-transparent'
      }`}
      id='navbar-container'
      style={{
        zIndex: 999999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '60px',
      }}
      data-z-index='999999'
    >
      {/* Logo + nama brand */}
      <div
        className='flex gap-[8px] sm:gap-[15px] items-center shrink-0 flex-nowrap relative cursor-pointer'
        style={{ isolation: 'isolate', zIndex: 1000000 }}
        onClick={handleLogoClick}
      >
        <div className='w-[32px] h-[32px] sm:w-[42px] sm:h-[42px] shrink-0 relative overflow-hidden z-[12]'>
          <div
            className={`w-full h-full bg-[length:100%_100%] bg-no-repeat absolute top-0 left-0 z-[13] ${
              isScrolled
                ? 'bg-[url(/images/foody-icon.svg)]'
                : isProfilePage ||
                  isDetailPage ||
                  isCategoryPage ||
                  isCartPage ||
                  isCheckoutPage ||
                  isReviewPage ||
                  isReviewPage
                ? 'bg-[url(/images/foody-icon.svg)]'
                : 'bg-[url(/images/white-foody-icon.svg)]'
            }`}
          />
        </div>
        <span
          className={`hidden sm:inline h-[42px] shrink-0 basis-auto font-['Nunito'] text-[32px] font-extrabold leading-[42px] relative text-left whitespace-nowrap z-[14] ${
            isScrolled
              ? 'text-[#0a0d12]'
              : isProfilePage ||
                isDetailPage ||
                isCategoryPage ||
                isCartPage ||
                isCheckoutPage ||
                isReviewPage ||
                isReviewPage
              ? 'text-[#0a0d12]'
              : 'text-[#fdfdfd]'
          }`}
        >
          Foody
        </span>
      </div>

      {/* Mobile Navigation - Conditional rendering based on login status */}
      <div
        className='flex sm:hidden gap-[8px] items-center shrink-0 flex-nowrap relative'
        style={{ isolation: 'isolate', zIndex: 1000000 }}
      >
        {!isLoggedIn ? (
          <>
            {/* Tombol Sign In Mobile */}
            <button
              onClick={handleSignIn}
              className={`flex w-[80px] h-[36px] pt-[6px] pr-[8px] pb-[6px] pl-[8px] gap-[4px] justify-center items-center shrink-0 flex-nowrap rounded-[100px] border-solid border-2 border-[#d5d7da] relative z-30 hover:bg-[#f5f5f5] transition-colors cursor-pointer ${
                isScrolled ? 'bg-white' : 'bg-transparent'
              }`}
            >
              <span
                className={`h-[24px] shrink-0 basis-auto font-['Nunito'] text-[12px] font-bold leading-[24px] tracking-[-0.24px] relative text-left whitespace-nowrap z-[17] ${
                  isScrolled ||
                  isDetailPage ||
                  isCategoryPage ||
                  isCartPage ||
                  isCheckoutPage ||
                  isReviewPage
                    ? 'text-[#0a0d12]'
                    : 'text-[#fff]'
                }`}
              >
                Sign In
              </span>
            </button>
            {/* Tombol Sign Up Mobile */}
            <button
              onClick={handleSignUp}
              className='flex w-[80px] h-[36px] pt-[6px] pr-[8px] pb-[6px] pl-[8px] gap-[4px] justify-center items-center shrink-0 flex-nowrap bg-[#fff] rounded-[100px] relative z-30 hover:bg-[#f5f5f5] transition-colors cursor-pointer'
            >
              <span className="h-[24px] shrink-0 basis-auto font-['Nunito'] text-[12px] font-bold leading-[24px] text-[#0a0d12] tracking-[-0.24px] relative text-left whitespace-nowrap z-[19]">
                Sign Up
              </span>
            </button>
          </>
        ) : (
          <>
            {/* Shopping Bag Icon */}
            <div className='relative'>
              <button
                onClick={handleCartClick}
                className='flex w-[24px] h-[24px] justify-center items-center shrink-0 flex-nowrap relative z-30 hover:opacity-80 transition-opacity cursor-pointer'
              >
                <div
                  className={`w-[24px] h-[24px] shrink-0 bg-cover bg-no-repeat relative z-[17] ${
                    isScrolled ||
                    isProfilePage ||
                    isDetailPage ||
                    isCategoryPage ||
                    isCartPage ||
                    isCheckoutPage ||
                    isReviewPage
                      ? 'bg-[url(/images/black-cart-icon.png)]'
                      : 'bg-[url(/images/cart-icon.png)]'
                  }`}
                />
              </button>
              {cartCount > 0 && (
                <span className='absolute -top-1 -right-1 min-w-[18px] h-[18px] px-[4px] rounded-full bg-[#c12116] text-white text-[10px] font-bold flex items-center justify-center z-[1000]'>
                  {cartCount}
                </span>
              )}
            </div>

            {/* Profile Section */}
            <div
              className='flex gap-[8px] items-center shrink-0 flex-nowrap relative z-30 cursor-pointer'
              onClick={handleProfileClick}
            >
              {/* Profile Photo */}
              <div className='w-[32px] h-[32px] shrink-0 rounded-full overflow-hidden relative z-[18]'>
                <Image
                  src='/images/profile-photo.png'
                  alt='Profile'
                  width={32}
                  height={32}
                  className='w-full h-full object-cover'
                />
              </div>

              {/* User Name */}
              <span
                className={`h-[20px] shrink-0 basis-auto font-['Nunito'] text-[14px] font-medium leading-[20px] tracking-[-0.28px] relative text-left whitespace-nowrap z-[19] ${
                  isScrolled
                    ? 'text-[#0a0d12]'
                    : isProfilePage ||
                      isDetailPage ||
                      isCategoryPage ||
                      isCartPage ||
                      isCheckoutPage ||
                      isReviewPage
                    ? 'text-[#0a0d12]'
                    : 'text-[#fff]'
                }`}
              >
                {userData?.name || 'User'}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Desktop Menu navigasi Sign In / Sign Up */}
      <div
        className='hidden sm:flex w-[688.5px] gap-[16px] justify-end items-center shrink-0 flex-nowrap relative'
        style={{ isolation: 'isolate', zIndex: 1000000 }}
      >
        {!isLoggedIn ? (
          <>
            {/* Tombol Sign In */}
            <button
              onClick={handleSignIn}
              className={`flex w-[163px] h-[48px] pt-[8px] pr-[8px] pb-[8px] pl-[8px] gap-[8px] justify-center items-center shrink-0 flex-nowrap rounded-[100px] border-solid border-2 border-[#d5d7da] relative z-30 hover:bg-[#f5f5f5] transition-colors cursor-pointer ${
                isScrolled ? 'bg-white' : 'bg-transparent'
              }`}
            >
              <span
                className={`h-[30px] shrink-0 basis-auto font-['Nunito'] text-[16px] font-bold leading-[30px] tracking-[-0.32px] relative text-left whitespace-nowrap z-[17] ${
                  isScrolled || isDetailPage ? 'text-[#0a0d12]' : 'text-[#fff]'
                }`}
              >
                Sign In
              </span>
            </button>
            {/* Tombol Sign Up */}
            <button
              onClick={handleSignUp}
              className='flex w-[163px] h-[48px] pt-[8px] pr-[8px] pb-[8px] pl-[8px] gap-[8px] justify-center items-center shrink-0 flex-nowrap bg-[#fff] rounded-[100px] relative z-30 hover:bg-[#f5f5f5] transition-colors cursor-pointer'
            >
              <span className="h-[30px] shrink-0 basis-auto font-['Nunito'] text-[16px] font-bold leading-[30px] text-[#0a0d12] tracking-[-0.32px] relative text-left whitespace-nowrap z-[19]">
                Sign Up
              </span>
            </button>
          </>
        ) : (
          <>
            {/* Shopping Bag Icon */}
            <div className='relative'>
              <button
                onClick={handleCartClick}
                className='flex w-[40px] h-[40px] justify-center items-center shrink-0 flex-nowrap relative z-30 hover:opacity-80 transition-opacity cursor-pointer'
              >
                <div
                  className={`w-[24px] h-[24px] shrink-0 bg-cover bg-no-repeat relative z-[17] ${
                    isScrolled ||
                    isProfilePage ||
                    isDetailPage ||
                    isCategoryPage ||
                    isCartPage ||
                    isCheckoutPage ||
                    isReviewPage
                      ? 'bg-[url(/images/black-cart-icon.png)]'
                      : 'bg-[url(/images/cart-icon.png)]'
                  }`}
                />
              </button>
              {cartCount > 0 && (
                <span className='absolute -top-1 -right-1 min-w-[18px] h-[18px] px-[5px] rounded-full bg-[#c12116] text-white text-[10px] font-extrabold flex items-center justify-center z-[1000]'>
                  {cartCount}
                </span>
              )}
            </div>

            {/* Profile Section */}
            <div
              className='flex gap-[12px] items-center shrink-0 flex-nowrap relative z-30 cursor-pointer'
              onClick={handleProfileClick}
            >
              {/* Profile Photo */}
              <div className='w-[40px] h-[40px] shrink-0 rounded-full overflow-hidden relative z-[18]'>
                <Image
                  src='/images/profile-photo.png'
                  alt='Profile'
                  width={40}
                  height={40}
                  className='w-full h-full object-cover'
                />
              </div>

              {/* User Name */}
              <span
                className={`h-[24px] shrink-0 basis-auto font-['Nunito'] text-[16px] font-medium leading-[24px] tracking-[-0.32px] relative text-left whitespace-nowrap z-[19] ${
                  isScrolled
                    ? 'text-[#0a0d12]'
                    : isProfilePage ||
                      isDetailPage ||
                      isCategoryPage ||
                      isCartPage ||
                      isCheckoutPage ||
                      isReviewPage
                    ? 'text-[#0a0d12]'
                    : 'text-[#fff]'
                }`}
              >
                {userData?.name || 'User'}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className={`flex w-[80px] h-[36px] pt-[6px] pr-[8px] pb-[6px] pl-[8px] gap-[4px] justify-center items-center shrink-0 flex-nowrap rounded-[100px] border-solid border border-[#d5d7da] relative z-30 hover:bg-[#f5f5f5] transition-colors cursor-pointer ${
                isScrolled ||
                isProfilePage ||
                isDetailPage ||
                isCategoryPage ||
                isCartPage ||
                isCheckoutPage ||
                isReviewPage
                  ? 'bg-white'
                  : 'bg-transparent'
              }`}
            >
              <span
                className={`h-[20px] shrink-0 basis-auto font-['Nunito'] text-[12px] font-bold leading-[20px] tracking-[-0.24px] relative text-left whitespace-nowrap z-[17] ${
                  isScrolled
                    ? 'text-[#0a0d12]'
                    : isProfilePage ||
                      isDetailPage ||
                      isCategoryPage ||
                      isCartPage ||
                      isCheckoutPage ||
                      isReviewPage
                    ? 'text-[#0a0d12]'
                    : 'text-[#fff]'
                }`}
              >
                Logout
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
