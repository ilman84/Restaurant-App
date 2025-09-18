'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authService, RegisterData } from '../../services/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setFormData((prev: RegisterData) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev: { [key: string]: string }) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await authService.register(formData);

      if (response.success && response.data) {
        // Show success toast
        toast.success('Registration successful! Please sign in to continue.');

        // Redirect to login page
        router.push('/login');
      } else {
        // Handle API errors
        if (response.errors && response.errors.length > 0) {
          setErrors({ general: response.errors[0] });
          toast.error(response.errors[0]);
        } else {
          setErrors({ general: response.message || 'Registration failed' });
          toast.error(response.message || 'Registration failed');
        }
      }
    } catch {
      setErrors({ general: 'Network error. Please try again.' });
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-[#fff]'>
      {/* Background putih full page */}
      <div className='w-full max-w-[1440px] h-[1024px] bg-[#fff] relative overflow-hidden'>
        {/* Bagian kiri: background gambar dekorasi - hidden on mobile */}
        <div className='hidden md:block w-[720px] h-[1024px] absolute top-0 left-0 overflow-hidden'>
          <div className='w-[1477px] h-[1038px] bg-[url(/images/burger.png)] bg-cover bg-no-repeat absolute top-0 left-[-425px] z-[1]' />
        </div>

        {/* Form register - responsive untuk mobile 393px */}
        <div className='flex w-full max-w-[393px] md:w-[374px] h-auto md:h-[658px] flex-col gap-[20px] items-start flex-nowrap absolute top-[50px] md:top-[151px] left-1/2 transform -translate-x-1/2 md:left-[950px] md:transform-none px-4 md:px-0 z-[2]'>
          {/* Logo + Nama Brand */}
          <div className='flex w-[149px] gap-[15px] items-center z-[3]'>
            {/* Icon logo */}
            <div className='w-[42px] h-[42px] relative overflow-hidden z-[4]'>
              <div className='w-full h-full bg-[url(/images/foody-icon.svg)] bg-[length:100%_100%] bg-no-repeat absolute top-0 left-0 z-[5]' />
            </div>
            {/* Teks brand */}
            <span className="h-[42px] font-['Nunito'] text-[32px] font-extrabold leading-[42px] text-[#0a0d12] z-[6]">
              Foody
            </span>
          </div>

          {/* Teks sambutan */}
          <div className='flex flex-col gap-[4px] items-start self-stretch z-[7]'>
            <span className="text-[28px] font-extrabold leading-[38px] text-[#0a0d12] font-['Nunito'] z-[8]">
              Welcome Back
            </span>
            <span className="text-[16px] font-medium leading-[30px] text-[#0a0d12] tracking-[-0.48px] font-['Nunito'] z-[9]">
              Good to see you again! Let&apos;s eat
            </span>
          </div>

          {/* Tab pilihan Sign in / Sign up */}
          <div className='flex p-[8px] gap-[8px] items-center bg-[#f4f4f4] rounded-[16px] z-10'>
            {/* Tab Sign in (non aktif) */}
            <div
              className='flex h-[40px] px-[12px] items-center justify-center z-[11] cursor-pointer'
              onClick={() => router.push('/login')}
            >
              <span className="text-[16px] font-medium text-[#535861] font-['Nunito']">
                Sign in
              </span>
            </div>
            {/* Tab Sign up (aktif) */}
            <div className='flex h-[40px] px-[12px] items-center justify-center bg-[#fff] rounded-[12px] shadow-[0_0_20px_0_rgba(202,201,201,0.25)] z-[13]'>
              <span className="text-[16px] font-bold text-[#0a0d12] font-['Nunito']">
                Sign up
              </span>
            </div>
          </div>

          {/* Input fields */}
          <form
            id='registerForm'
            onSubmit={handleSubmit}
            className='flex flex-col gap-[20px] self-stretch z-[15]'
          >
            {/* Field Name */}
            <div className='flex flex-col gap-[4px]'>
              <div
                className={`flex h-[56px] px-[12px] items-center justify-between rounded-[12px] border ${
                  errors.name ? 'border-red-500' : 'border-[#d5d7da]'
                } z-[16]`}
              >
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder='Name'
                  className="flex-1 text-[16px] text-[#0a0d12] bg-transparent outline-none font-['Nunito']"
                />
                <div className='w-[16px] h-[16px] bg-[url(/images/ceklis.svg)] bg-cover bg-no-repeat z-[18]' />
              </div>
              {errors.name && (
                <span className="text-[14px] text-red-500 px-[4px] font-['Nunito']">
                  {errors.name}
                </span>
              )}
            </div>

            {/* Field Email */}
            <div className='flex flex-col gap-[4px]'>
              <div
                className={`flex h-[56px] px-[12px] items-center justify-between rounded-[12px] border ${
                  errors.email ? 'border-red-500' : 'border-[#d5d7da]'
                } z-[19]`}
              >
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder='Email'
                  className="flex-1 text-[16px] text-[#0a0d12] bg-transparent outline-none font-['Nunito']"
                />
                <div className='w-[16px] h-[16px] bg-[url(/images/ceklis.svg)] bg-cover bg-no-repeat z-[21]' />
              </div>
              {errors.email && (
                <span className="text-[14px] text-red-500 px-[4px] font-['Nunito']">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Field Number Phone */}
            <div className='flex flex-col gap-[4px]'>
              <div
                className={`flex h-[56px] px-[12px] items-center justify-between rounded-[12px] border ${
                  errors.phone ? 'border-red-500' : 'border-[#d5d7da]'
                } z-[22]`}
              >
                <input
                  type='tel'
                  name='phone'
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder='Number Phone'
                  className="flex-1 text-[16px] text-[#0a0d12] bg-transparent outline-none font-['Nunito']"
                />
                <div className='w-[16px] h-[16px] bg-[url(/images/ceklis.svg)] bg-cover bg-no-repeat z-[24]' />
              </div>
              {errors.phone && (
                <span className="text-[14px] text-red-500 px-[4px] font-['Nunito']">
                  {errors.phone}
                </span>
              )}
            </div>

            {/* Field Password */}
            <div className='flex flex-col gap-[4px]'>
              <div
                className={`flex h-[56px] px-[12px] items-center justify-between rounded-[12px] border ${
                  errors.password ? 'border-red-500' : 'border-[#d5d7da]'
                } z-[25]`}
              >
                <input
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder='Password'
                  className="flex-1 text-[16px] text-[#0a0d12] bg-transparent outline-none font-['Nunito']"
                />
                <div className='w-[16px] h-[16px] bg-[url(/images/eye.svg)] bg-cover bg-no-repeat z-[27]' />
              </div>
              {errors.password && (
                <span className="text-[14px] text-red-500 px-[4px] font-['Nunito']">
                  {errors.password}
                </span>
              )}
            </div>

            {/* Field Confirm Password */}
            <div className='flex flex-col gap-[4px]'>
              <div
                className={`flex h-[56px] px-[12px] items-center justify-between rounded-[12px] border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-[#d5d7da]'
                } z-[28]`}
              >
                <input
                  type='password'
                  name='confirmPassword'
                  value={confirmPassword}
                  onChange={handleInputChange}
                  placeholder='Confirm Password'
                  className="flex-1 text-[16px] text-[#0a0d12] bg-transparent outline-none font-['Nunito']"
                />
                <div className='w-[16px] h-[16px] bg-[url(/images/eye.svg)] bg-cover bg-no-repeat z-30' />
              </div>
              {errors.confirmPassword && (
                <span className="text-[14px] text-red-500 px-[4px] font-['Nunito']">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            {/* Error Message */}
            {errors.general && (
              <div className="text-[14px] text-red-500 px-[4px] bg-red-50 p-2 rounded font-['Nunito']">
                {errors.general}
              </div>
            )}
          </form>

          {/* Tombol Register */}
          <button
            type='submit'
            form='registerForm'
            disabled={isLoading}
            className='flex h-[48px] p-[8px] justify-center items-center bg-[#c12116] rounded-[100px] z-[31] hover:bg-[#a01a12] disabled:opacity-50 disabled:cursor-not-allowed w-full'
          >
            <span className="text-[16px] font-bold text-[#fdfdfd] font-['Nunito']">
              {isLoading ? 'Registering...' : 'Register'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
