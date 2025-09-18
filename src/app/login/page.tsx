'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authService, LoginData } from '../../services/auth';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: LoginData) => ({
      ...prev,
      [name]: value,
    }));
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

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      const response = await authService.login(formData);

      if (response.success && response.data) {
        // Save auth data using service
        authService.setAuthData(response.data.user, response.data.token);

        // Handle remember me
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }

        // Show success toast
        toast.success('Login successful! Welcome back!');

        // Redirect to home page
        router.push('/home');
      } else {
        // Handle API errors
        if (response.errors && response.errors.length > 0) {
          setErrors({ general: response.errors[0] });
          toast.error(response.errors[0]);
        } else {
          setErrors({ general: response.message || 'Login failed' });
          toast.error(response.message || 'Login failed');
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
        {/* Bagian kiri berisi gambar background - hidden on mobile */}
        <div className='hidden md:block w-[720px] h-[1024px] absolute top-0 left-0 overflow-hidden z-[1]'>
          <div className='w-[1477px] h-[1038px] bg-[url(/images/burger.png)] bg-cover bg-no-repeat absolute top-0 left-[-425px] z-[2]' />
        </div>

        {/* Form login - responsive untuk mobile 393px */}
        <div className='flex w-full max-w-[393px] md:w-[374px] h-auto md:h-[480px] flex-col gap-[20px] items-start flex-nowrap absolute top-[50px] md:top-[272px] left-1/2 transform -translate-x-1/2 md:left-[950px] md:transform-none px-4 md:px-0 z-[3]'>
          {/* Logo + Brand Name */}
          <div className='flex w-[149px] gap-[15px] items-center shrink-0 flex-nowrap relative z-[4]'>
            {/* Icon logo */}
            <div className='w-[42px] h-[42px] shrink-0 relative overflow-hidden z-[5]'>
              <div className='w-full h-full bg-[url(/images/foody-icon.svg)] bg-[length:100%_100%] bg-no-repeat absolute top-0 left-0 z-[6]' />
            </div>
            {/* Nama brand */}
            <span className="h-[42px] font-['Nunito'] text-[32px] font-extrabold leading-[42px] text-[#0a0d12] z-[7]">
              Foody
            </span>
          </div>

          {/* Teks sambutan */}
          <div className='flex flex-col gap-[4px] items-start self-stretch z-[8]'>
            <span className="text-[28px] font-extrabold leading-[38px] text-[#0a0d12] font-['Nunito'] z-[9]">
              Welcome Back
            </span>
            <span className="text-[16px] font-medium leading-[30px] text-[#0a0d12] tracking-[-0.48px] font-['Nunito'] z-10">
              Good to see you again! Let&apos;s eat
            </span>
          </div>

          {/* Tab Sign in / Sign up */}
          <div className='flex p-[8px] gap-[8px] items-center bg-[#f4f4f4] rounded-[16px] z-[11]'>
            {/* Tab aktif Sign in */}
            <div className='flex h-[40px] px-[12px] items-center justify-center bg-[#fff] rounded-[12px] shadow-[0_0_20px_0_rgba(202,201,201,0.25)] z-[12]'>
              <span className="text-[16px] font-bold text-[#0a0d12] font-['Nunito']">
                Sign in
              </span>
            </div>
            {/* Tab non-aktif Sign up */}
            <div
              className='flex h-[40px] px-[12px] items-center justify-center z-[14] cursor-pointer'
              onClick={() => router.push('/register')}
            >
              <span className="text-[16px] font-medium text-[#535861] font-['Nunito']">
                Sign up
              </span>
            </div>
          </div>

          {/* Form input Email & Password */}
          <form
            id='loginForm'
            onSubmit={handleSubmit}
            className='flex flex-col gap-[20px] self-stretch z-[16]'
          >
            {/* Field Email */}
            <div className='flex flex-col gap-[4px]'>
              <div
                className={`flex h-[56px] px-[12px] items-center justify-between rounded-[12px] border ${
                  errors.email ? 'border-red-500' : 'border-[#d5d7da]'
                } z-[17]`}
              >
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder='Email'
                  className="flex-1 text-[16px] text-[#0a0d12] bg-transparent outline-none font-['Nunito']"
                />
                <div className='w-[16px] h-[16px] bg-[url(/images/accordian-bawah.svg)] bg-cover bg-no-repeat z-[19]' />
              </div>
              {errors.email && (
                <span className="text-[14px] text-red-500 px-[4px] font-['Nunito']">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Field Password */}
            <div className='flex flex-col gap-[4px]'>
              <div
                className={`flex h-[56px] px-[12px] items-center justify-between rounded-[12px] border ${
                  errors.password ? 'border-red-500' : 'border-[#d5d7da]'
                } z-20`}
              >
                <input
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder='Password'
                  className="flex-1 text-[16px] text-[#0a0d12] bg-transparent outline-none font-['Nunito']"
                />
                <div className='w-[16px] h-[16px] bg-[url(/images/eye.svg)] bg-cover bg-no-repeat z-[22]' />
              </div>
              {errors.password && (
                <span className="text-[14px] text-red-500 px-[4px] font-['Nunito']">
                  {errors.password}
                </span>
              )}
            </div>

            {/* Checkbox Remember Me */}
            <div className='flex w-[129px] gap-[8px] items-center z-[23]'>
              <input
                type='checkbox'
                id='rememberMe'
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className='w-[20px] h-[20px] rounded-[6px] border border-[#d5d7da] z-[24]'
              />
              <label
                htmlFor='rememberMe'
                className="text-[16px] font-medium text-[#0a0d12] cursor-pointer font-['Nunito']"
              >
                Remember Me
              </label>
            </div>

            {/* Error Message */}
            {errors.general && (
              <div className="text-[14px] text-red-500 px-[4px] bg-red-50 p-2 rounded font-['Nunito']">
                {errors.general}
              </div>
            )}
          </form>

          {/* Tombol Login */}
          <button
            type='submit'
            form='loginForm'
            disabled={isLoading}
            className='flex h-[48px] p-[8px] justify-center items-center bg-[#c12116] rounded-[100px] z-[26] hover:bg-[#a01a12] disabled:opacity-50 disabled:cursor-not-allowed w-full'
          >
            <span className="text-[16px] font-bold text-[#fdfdfd] font-['Nunito']">
              {isLoading ? 'Logging in...' : 'Login'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
