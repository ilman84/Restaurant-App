'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { authService, User } from '../../services/auth';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import Orders from '@/components/profile/orders';

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'profile' | 'orders'>(
    'profile'
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Check if user is logged in
        const authData = authService.getAuthData();
        if (!authData) {
          router.push('/login');
          return;
        }

        // Fetch fresh profile data from API
        const response = await authService.getProfile();
        if (response.success && response.data) {
          setUserData(response.data);
          // Update local storage with fresh data
          if (authData.token) {
            authService.setAuthData(response.data, authData.token);
          }
        } else {
          // Fallback to local data if API fails
          setUserData(authData.user);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Fallback to local data
        const authData = authService.getAuthData();
        if (authData) {
          setUserData(authData.user);
        } else {
          router.push('/login');
          return;
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    authService.clearAuthData();
    router.push('/login');
  };

  const handleUpdateProfile = async () => {
    // TODO: Implement update profile functionality
    // For now, just show a placeholder message
    console.log('Update profile clicked');
    alert('Update profile functionality will be implemented soon!');
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#c12116] mx-auto'></div>
          <p className="mt-4 text-[#0a0d12] font-['Nunito']">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className='w-full min-h-screen bg-[#f8f9fa] relative overflow-hidden'>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className='pt-[60px] sm:pt-[80px] min-h-screen w-full overflow-hidden'>
        {/* Mobile Layout - 393px */}
        <div className='w-full max-w-[393px] mx-auto px-4 py-6 sm:hidden'>
          {/* Page Title */}
          <h1 className="text-[#0a0d12] font-['Nunito'] text-[24px] font-bold mb-6">
            Profile
          </h1>

          {/* Left Sidebar - Mobile */}
          <div className='w-full bg-white rounded-[16px] shadow-[0_0_20px_0_rgba(202,201,201,0.25)] p-4 mb-6'>
            {/* Profile Header */}
            <div className='flex items-center mb-4 pb-3 border-b border-gray-100'>
              <div
                className='w-[40px] h-[40px] rounded-full overflow-hidden bg-gray-200 mr-3 flex-shrink-0 cursor-pointer'
                onClick={() => setActiveSection('profile')}
                role='button'
                aria-label='View Profile Details'
              >
                <Image
                  src='/images/profile-photo.png'
                  alt='Profile Picture'
                  width={40}
                  height={40}
                  className='w-full h-full object-cover'
                />
              </div>
              <span
                className="text-[#0a0d12] font-['Nunito'] text-[16px] font-bold truncate cursor-pointer"
                onClick={() => setActiveSection('profile')}
                role='button'
                aria-label='View Profile Details'
              >
                {userData.name}
              </span>
            </div>

            {/* Menu Items */}
            <div className='space-y-1'>
              {/* Delivery Address */}
              <button className='w-full flex items-center py-3 px-2 hover:bg-gray-50 rounded-[8px] transition-colors'>
                <div className='w-[20px] h-[20px] bg-[url(/images/location-icon.svg)] bg-cover bg-no-repeat mr-3 flex-shrink-0'></div>
                <span className="text-[#0a0d12] font-['Nunito'] text-[14px] font-medium truncate">
                  Delivery Address
                </span>
              </button>

              {/* My Orders */}
              <button
                onClick={() => setActiveSection('orders')}
                className={`w-full flex items-center py-3 px-2 rounded-[8px] transition-colors ${
                  activeSection === 'orders'
                    ? 'bg-gray-100'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className='w-[20px] h-[20px] bg-[url(/images/orders-icon.svg)] bg-cover bg-no-repeat mr-3 flex-shrink-0'></div>
                <span
                  className={`text-[#0a0d12] font-['Nunito'] text-[14px] font-medium truncate ${
                    activeSection === 'orders' ? 'font-bold' : ''
                  }`}
                >
                  My Orders
                </span>
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className='w-full flex items-center py-3 px-2 hover:bg-gray-50 rounded-[8px] transition-colors'
              >
                <div className='w-[20px] h-[20px] bg-[url(/images/logout-icon.svg)] bg-cover bg-no-repeat mr-3 flex-shrink-0'></div>
                <span className="text-[#0a0d12] font-['Nunito'] text-[14px] font-medium truncate">
                  Logout
                </span>
              </button>
            </div>
          </div>

          {/* Right Content - Mobile */}
          <div className='w-full'>
            {activeSection === 'profile' ? (
              <div className='w-full'>
                {/* Profile Card */}
                <div className='bg-white rounded-[16px] shadow-[0_0_20px_0_rgba(202,201,201,0.25)] p-6'>
                  {/* Profile Picture */}
                  <div className='flex justify-start mb-6'>
                    <div className='w-[64px] h-[64px] rounded-full overflow-hidden bg-gray-200'>
                      <Image
                        src='/images/profile-photo.png'
                        alt='Profile Picture'
                        width={64}
                        height={64}
                        className='w-full h-full object-cover'
                      />
                    </div>
                  </div>

                  {/* User Details */}
                  <div className='space-y-4 mb-8'>
                    {/* Name */}
                    <div className='flex justify-between items-center py-3 border-b border-gray-100'>
                      <span className="text-[#6b7280] font-['Nunito'] text-[16px] font-medium">
                        Name
                      </span>
                      <span className="text-[#0a0d12] font-['Nunito'] text-[16px] font-semibold">
                        {userData.name}
                      </span>
                    </div>

                    {/* Email */}
                    <div className='flex justify-between items-center py-3 border-b border-gray-100'>
                      <span className="text-[#6b7280] font-['Nunito'] text-[16px] font-medium">
                        Email
                      </span>
                      <span className="text-[#0a0d12] font-['Nunito'] text-[16px] font-semibold">
                        {userData.email}
                      </span>
                    </div>

                    {/* Phone Number */}
                    <div className='flex justify-between items-center py-3 border-b border-gray-100'>
                      <span className="text-[#6b7280] font-['Nunito'] text-[16px] font-medium">
                        Nomor Handphone
                      </span>
                      <span className="text-[#0a0d12] font-['Nunito'] text-[16px] font-semibold">
                        {userData.phone}
                      </span>
                    </div>
                  </div>

                  {/* Update Profile Button */}
                  <button
                    onClick={handleUpdateProfile}
                    className="w-full bg-[#c12116] text-white font-['Nunito'] text-[16px] font-bold py-3 px-6 rounded-[100px] hover:bg-[#a01a12] transition-colors"
                  >
                    Update Profile
                  </button>
                </div>
              </div>
            ) : (
              <Orders />
            )}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className='hidden sm:block w-full max-w-[1200px] mx-auto px-8 py-8'>
          <div className='flex gap-8'>
            {/* Left Sidebar - Navigation */}
            <div className='w-[240px] h-[274px] bg-white rounded-[16px] shadow-[0_0_20px_0_rgba(202,201,201,0.25)] p-4 overflow-hidden'>
              {/* Profile Header */}
              <div className='flex items-center mb-4 pb-3 border-b border-gray-100'>
                <div
                  className='w-[40px] h-[40px] rounded-full overflow-hidden bg-gray-200 mr-3 flex-shrink-0 cursor-pointer'
                  onClick={() => setActiveSection('profile')}
                  role='button'
                  aria-label='View Profile Details'
                >
                  <Image
                    src='/images/profile-photo.png'
                    alt='Profile Picture'
                    width={40}
                    height={40}
                    className='w-full h-full object-cover'
                  />
                </div>
                <span
                  className="text-[#0a0d12] font-['Nunito'] text-[16px] font-bold truncate cursor-pointer"
                  onClick={() => setActiveSection('profile')}
                  role='button'
                  aria-label='View Profile Details'
                >
                  {userData.name}
                </span>
              </div>

              {/* Menu Items */}
              <div className='space-y-1'>
                {/* Delivery Address */}
                <button className='w-full flex items-center py-3 px-2 hover:bg-gray-50 rounded-[8px] transition-colors'>
                  <div className='w-[20px] h-[20px] bg-[url(/images/location-icon.svg)] bg-cover bg-no-repeat mr-3 flex-shrink-0'></div>
                  <span className="text-[#0a0d12] font-['Nunito'] text-[14px] font-medium truncate">
                    Delivery Address
                  </span>
                </button>

                {/* My Orders */}
                <button
                  onClick={() => setActiveSection('orders')}
                  className={`w-full flex items-center py-3 px-2 rounded-[8px] transition-colors ${
                    activeSection === 'orders'
                      ? 'bg-gray-100'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className='w-[20px] h-[20px] bg-[url(/images/orders-icon.svg)] bg-cover bg-no-repeat mr-3 flex-shrink-0'></div>
                  <span
                    className={`text-[#0a0d12] font-['Nunito'] text-[14px] font-medium truncate ${
                      activeSection === 'orders' ? 'font-bold' : ''
                    }`}
                  >
                    My Orders
                  </span>
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className='w-full flex items-center py-3 px-2 hover:bg-gray-50 rounded-[8px] transition-colors'
                >
                  <div className='w-[20px] h-[20px] bg-[url(/images/logout-icon.svg)] bg-cover bg-no-repeat mr-3 flex-shrink-0'></div>
                  <span className="text-[#0a0d12] font-['Nunito'] text-[14px] font-medium truncate">
                    Logout
                  </span>
                </button>
              </div>
            </div>

            {/* Right Content - Switchable */}
            <div className='flex-1 overflow-visible'>
              {activeSection === 'profile' ? (
                <div className='w-[524px] h-[298px] overflow-hidden'>
                  {/* Page Title */}
                  <h1 className="text-[#0a0d12] font-['Nunito'] text-[24px] font-bold mb-4">
                    Profile
                  </h1>
                  {/* Profile Card */}
                  <div className='bg-white rounded-[16px] shadow-[0_0_20px_0_rgba(202,201,201,0.25)] p-4 h-[250px] flex flex-col'>
                    {/* Profile Picture */}
                    <div className='flex justify-start mb-3'>
                      <div className='w-[64px] h-[64px] rounded-full overflow-hidden bg-gray-200 flex-shrink-0'>
                        <Image
                          src='/images/profile-photo.png'
                          alt='Profile Picture'
                          width={64}
                          height={64}
                          className='w-full h-full object-cover'
                        />
                      </div>
                    </div>
                    {/* User Details */}
                    <div className='space-y-1 mb-3 flex-1'>
                      <div className='flex justify-between items-center py-1 border-b border-gray-100'>
                        <span className="text-[#6b7280] font-['Nunito'] text-[12px] font-medium truncate">
                          Name
                        </span>
                        <span className="text-[#0a0d12] font-['Nunito'] text-[12px] font-semibold truncate ml-2">
                          {userData.name}
                        </span>
                      </div>
                      <div className='flex justify-between items-center py-1 border-b border-gray-100'>
                        <span className="text-[#6b7280] font-['Nunito'] text-[12px] font-medium truncate">
                          Email
                        </span>
                        <span className="text-[#0a0d12] font-['Nunito'] text-[12px] font-semibold truncate ml-2">
                          {userData.email}
                        </span>
                      </div>
                      <div className='flex justify-between items-center py-1 border-b border-gray-100'>
                        <span className="text-[#6b7280] font-['Nunito'] text-[12px] font-medium truncate">
                          Nomor Handphone
                        </span>
                        <span className="text-[#0a0d12] font-['Nunito'] text-[12px] font-semibold truncate ml-2">
                          {userData.phone}
                        </span>
                      </div>
                    </div>
                    {/* Update Profile Button */}
                    <button
                      onClick={handleUpdateProfile}
                      className="w-full bg-[#c12116] text-white font-['Nunito'] text-[12px] font-bold py-2 px-3 rounded-[100px] hover:bg-[#a01a12] transition-colors flex-shrink-0"
                    >
                      Update Profile
                    </button>
                  </div>
                </div>
              ) : (
                <Orders />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
