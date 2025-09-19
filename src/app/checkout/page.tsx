'use client';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageWithInitial from '@/components/ui/ImageWithInitial';
import { orderService } from '@/services/orderService';
import { cartService, CartGroup } from '@/services/cartService';
import { formatRupiah } from '@/lib/utils';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutData, setCheckoutData] = useState<{
    groups: CartGroup[];
    totalPrice: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<
    | 'Bank Negara Indonesia'
    | 'Bank Rakyat Indonesia'
    | 'Bank Central Asia'
    | 'Mandiri'
  >('Bank Negara Indonesia');

  // Address state
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: 'Jl. Sudirman No. 25, Jakarta Pusat, 10220',
    phone: '0812-3456-7890',
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState({
    street: '',
    phone: '',
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await cartService.getCart();
        if (mounted && res.success && res.data) {
          const groups = res.data.cart || [];
          const apiTotal = res.data.summary?.totalPrice ?? 0;
          const computed = groups.reduce(
            (sum, g) => sum + (g.subtotal || 0),
            0
          );
          setCheckoutData({ groups, totalPrice: apiTotal || computed });
        }
        if (mounted && (!res.success || !res.data)) {
          setError(res.message || 'Failed to load cart');
        }
      } catch (e: unknown) {
        if (mounted) setError((e as Error).message || 'Failed to load cart');
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleChangeAddress = () => {
    setTempAddress({ ...deliveryAddress });
    setIsEditingAddress(true);
  };

  const handleSaveAddress = () => {
    if (!tempAddress.street.trim()) {
      toast.error('Address is required', {
        description: 'Please enter a delivery address.',
      });
      return;
    }
    if (!tempAddress.phone.trim()) {
      toast.error('Phone number is required', {
        description: 'Please enter a phone number.',
      });
      return;
    }
    if (!/^[0-9+\-\s()]+$/.test(tempAddress.phone)) {
      toast.error('Invalid phone number', {
        description: 'Please enter a valid phone number.',
      });
      return;
    }

    setDeliveryAddress({ ...tempAddress });
    setIsEditingAddress(false);
    toast.success('Address updated', {
      description: 'Your delivery address has been updated successfully.',
    });
  };

  const handleCancelEdit = () => {
    setTempAddress({ street: '', phone: '' });
    setIsEditingAddress(false);
  };

  const handleBuy = async () => {
    try {
      setError(null);
      setIsSubmitting(true);
      const res = await orderService.checkout({
        paymentMethod: selectedPayment,
        deliveryAddress: deliveryAddress.street,
        notes: 'Please ring the doorbell',
      });
      if (!res.success) throw new Error(res.message || 'Checkout failed');
      const itemsPrice = checkoutData?.totalPrice ?? 0;
      const deliveryFee = 10000;
      const serviceFee = 1000;
      const total = itemsPrice + deliveryFee + serviceFee;
      const ts = Date.now();
      const search = new URLSearchParams({
        ts: String(ts),
        method: selectedPayment,
        items: String(itemsPrice),
        delivery: String(deliveryFee),
        service: String(serviceFee),
        total: String(total),
        itemsCount: String(
          checkoutData
            ? checkoutData.groups.reduce(
                (total, group) =>
                  total +
                  group.items.reduce((sum, item) => sum + item.quantity, 0),
                0
              )
            : 0
        ),
      });
      router.push(`/payment-success?${search.toString()}`);
    } catch (e: unknown) {
      setError((e as Error).message || 'Checkout failed');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className='w-full min-h-screen bg-[#f8f9fa] relative overflow-hidden'>
      {/* Navbar */}
      <Navbar />
      {/* Top spacing to offset fixed navbar */}
      <div className='pt-[60px] sm:pt-[80px] w-full overflow-hidden'>
        {/* Main container */}
        <div className='main-container flex w-full max-w-[393px] sm:max-w-[1000px] flex-col gap-[24px] items-start flex-nowrap relative mx-auto my-0 px-4'>
          {/* Page title */}
          <span className="h-[42px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[24px] sm:text-[32px] font-extrabold leading-[42px] text-[#0a0d12] relative text-left whitespace-nowrap">
            Checkout
          </span>

          {/* Loading / Error */}
          {isLoading && (
            <div className="text-[#0a0d12] font-['Nunito'] text-[14px]">
              Loading checkout data...
            </div>
          )}
          {error && !isLoading && (
            <div className="text-[#c12116] font-['Nunito'] text-[14px]">
              {error}
            </div>
          )}
          {/* Content area: left (address + items) and right (payment sidebar) */}
          {!isLoading && !error && checkoutData && (
            <div className='flex flex-col sm:flex-row gap-[20px] items-start self-stretch shrink-0 flex-nowrap relative z-[1]'>
              {/* Left column */}
              <div className='flex flex-col gap-[20px] items-center grow shrink-0 basis-0 flex-nowrap relative z-[2]'>
                {/* Delivery address card */}
                <div className='flex pt-[20px] pr-[20px] pb-[20px] pl-[20px] flex-col gap-[21px] items-start w-[361px] h-[190px] sm:w-full sm:h-auto shrink-0 flex-nowrap bg-[#fff] rounded-[16px] relative shadow-[0_0_20px_0_rgba(202,201,201,0.25)] overflow-hidden z-[3]'>
                  <div className='flex flex-col gap-[4px] items-start self-stretch shrink-0 flex-nowrap relative z-[4]'>
                    <div className='flex w-[182px] gap-[8px] items-center shrink-0 flex-nowrap relative z-[5]'>
                      <div className='w-[32px] h-[32px] shrink-0 bg-[url(/images/location-icon.png)] bg-cover bg-no-repeat relative z-[6]' />
                      <span className="h-[32px] shrink-0 basis-auto font-['Nunito'] text-[18px] font-extrabold leading-[32px] text-[#0a0d12] tracking-[-0.36px] relative text-left whitespace-nowrap z-[7]">
                        Delivery Address
                      </span>
                    </div>
                    {isEditingAddress ? (
                      <div className='flex flex-col gap-[12px] w-full'>
                        <input
                          type='text'
                          value={tempAddress.street}
                          onChange={(e) =>
                            setTempAddress((prev) => ({
                              ...prev,
                              street: e.target.value,
                            }))
                          }
                          onKeyDown={(e) =>
                            e.key === 'Enter' && handleSaveAddress()
                          }
                          placeholder='Enter delivery address'
                          className="w-full h-[40px] px-[12px] py-[8px] border border-[#d5d7da] rounded-[8px] font-['Nunito'] text-[16px] font-medium text-[#0a0d12] outline-none focus:border-[#c12116]"
                        />
                        <input
                          type='tel'
                          value={tempAddress.phone}
                          onChange={(e) =>
                            setTempAddress((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          onKeyDown={(e) =>
                            e.key === 'Enter' && handleSaveAddress()
                          }
                          placeholder='Enter phone number'
                          className="w-full h-[40px] px-[12px] py-[8px] border border-[#d5d7da] rounded-[8px] font-['Nunito'] text-[16px] font-medium text-[#0a0d12] outline-none focus:border-[#c12116]"
                        />
                        <div className='flex gap-[8px] justify-end'>
                          <button
                            onClick={handleCancelEdit}
                            className="px-[16px] py-[8px] border border-[#d5d7da] rounded-[8px] font-['Nunito'] text-[14px] font-medium text-[#0a0d12] hover:bg-[#f5f5f5]"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveAddress}
                            className="px-[16px] py-[8px] bg-[#c12116] rounded-[8px] font-['Nunito'] text-[14px] font-medium text-white hover:bg-[#a01a12]"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className="h-[30px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[16px] font-medium leading-[30px] text-[#0a0d12] tracking-[-0.48px] relative text-left whitespace-nowrap z-[8]">
                          {deliveryAddress.street}
                        </span>
                        <span className="h-[30px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[16px] font-medium leading-[30px] text-[#0a0d12] tracking-[-0.48px] relative text-left whitespace-nowrap z-[9]">
                          {deliveryAddress.phone}
                        </span>
                      </>
                    )}
                  </div>
                  <button
                    onClick={
                      isEditingAddress ? handleCancelEdit : handleChangeAddress
                    }
                    className={`flex w-[120px] h-[40px] pt-[8px] pr-[8px] pb-[8px] pl-[8px] gap-[8px] justify-center items-center shrink-0 flex-nowrap rounded-[100px] border-solid border relative z-10 hover:opacity-80 transition-opacity ${
                      isEditingAddress
                        ? 'border-[#dc2626] bg-[#fef2f2]'
                        : 'border-[#d5d7da] bg-white'
                    }`}
                  >
                    <span
                      className={`h-[30px] shrink-0 basis-auto font-['Nunito'] text-[16px] font-bold leading-[30px] tracking-[-0.32px] relative text-left whitespace-nowrap z-[11] ${
                        isEditingAddress ? 'text-[#dc2626]' : 'text-[#0a0d12]'
                      }`}
                    >
                      {isEditingAddress ? 'Cancel' : 'Change'}
                    </span>
                  </button>
                </div>
                {/* Order items card */}
                <div className='flex pt-[20px] pr-[20px] pb-[20px] pl-[20px] flex-col gap-[12px] items-start w-[361px] h-[264px] sm:w-full sm:h-auto shrink-0 flex-nowrap bg-[#fff] rounded-[16px] relative shadow-[0_0_20px_0_rgba(202,201,201,0.25)] overflow-hidden z-[12]'>
                  {isLoading ? (
                    <div className="text-[#0a0d12] font-['Nunito'] text-[14px]">
                      Loading order items...
                    </div>
                  ) : error ? (
                    <div className="text-[#c12116] font-['Nunito'] text-[14px]">
                      {error}
                    </div>
                  ) : checkoutData ? (
                    <>
                      {checkoutData.groups.map((group, groupIndex) => (
                        <div key={groupIndex} className='w-full'>
                          <div className='flex justify-between items-center self-stretch shrink-0 flex-nowrap relative z-[13] mb-[12px]'>
                            <div className='flex w-[141px] gap-[8px] items-center shrink-0 flex-nowrap relative z-[14]'>
                              <div className='w-[32px] h-[32px] shrink-0 rounded-[8px] relative z-[15] overflow-hidden'>
                                <ImageWithInitial
                                  src={
                                    group.restaurant.logo || '/images/store.png'
                                  }
                                  alt={group.restaurant.name}
                                  fallbackText={group.restaurant.name}
                                  fill
                                  className='object-cover'
                                  sizes='32px'
                                />
                              </div>
                              <span className="h-[32px] shrink-0 basis-auto font-['Nunito'] text-[18px] font-bold leading-[32px] text-[#0a0d12] tracking-[-0.54px] relative text-left whitespace-nowrap z-[16]">
                                {group.restaurant.name}
                              </span>
                            </div>
                          </div>
                          {group.items.map((item, itemIndex) => (
                            <div
                              key={itemIndex}
                              className='flex justify-between items-center self-stretch shrink-0 flex-nowrap relative z-[19] mb-[8px]'
                            >
                              <div className='flex w-[140px] gap-[12px] items-center shrink-0 flex-nowrap relative z-20'>
                                <div className='w-[60px] h-[60px] shrink-0 rounded-[8px] relative z-[21] overflow-hidden'>
                                  <ImageWithInitial
                                    src={item.menu.image}
                                    alt={item.menu.foodName}
                                    fallbackText={item.menu.foodName}
                                    fill
                                    className='object-cover'
                                    sizes='60px'
                                  />
                                </div>
                                <div className='flex w-[68px] flex-col items-start shrink-0 flex-nowrap relative z-[22]'>
                                  <span className="h-[20px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[12px] font-medium leading-[20px] text-[#0a0d12] tracking-[-0.36px] relative text-left whitespace-nowrap z-[23]">
                                    {item.menu.foodName}
                                  </span>
                                  <span className="h-[22px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[14px] font-extrabold leading-[22px] text-[#0a0d12] tracking-[-0.28px] relative text-left whitespace-nowrap z-[24]">
                                    {formatRupiah(item.menu.price)}
                                  </span>
                                </div>
                              </div>
                              <div className='flex w-[180px] pt-[12px] pr-0 pb-[12px] pl-0 gap-[12px] justify-end items-center shrink-0 flex-nowrap relative z-[25]'>
                                <div className='flex w-[90px] gap-[12px] items-center shrink-0 flex-nowrap relative z-[26]'>
                                  <span className="h-[24px] shrink-0 basis-auto font-['Nunito'] text-[14px] font-semibold leading-[24px] text-[#0a0d12] tracking-[-0.28px] relative text-left whitespace-nowrap z-[29]">
                                    {item.quantity}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="text-[#0a0d12] font-['Nunito'] text-[14px]">
                      No items in cart
                    </div>
                  )}
                </div>
              </div>
              {/* Right column: payment methods and summary */}
              <div className='flex w-[361px] h-[660px] sm:w-[390px] sm:h-auto pt-[20px] pr-0 pb-[20px] pl-0 flex-col gap-[16px] items-start shrink-0 flex-nowrap bg-[#fff] rounded-[16px] relative shadow-[0_0_20px_0_rgba(202,201,201,0.25)] overflow-hidden z-[45]'>
                <div className='flex w-full h-[304px] pt-0 pr-[20px] pb-0 pl-[20px] flex-col gap-[16px] items-start shrink-0 flex-nowrap relative z-[46]'>
                  <span className="h-[32px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[18px] font-extrabold leading-[32px] text-[#0a0d12] tracking-[-0.36px] relative text-left whitespace-nowrap z-[47]">
                    Payment Method
                  </span>
                  <div className='flex flex-col w-full gap-[12px]'>
                    <button
                      type='button'
                      onClick={() =>
                        setSelectedPayment('Bank Negara Indonesia')
                      }
                      className='flex gap-[8px] justify-center items-center self-stretch shrink-0 flex-nowrap relative z-[48] text-left'
                    >
                      <div className='w-[40px] h-[40px] shrink-0 rounded-[8px] border-solid border-[0.74px] border-[#d5d7da] relative box-content overflow-hidden z-[49]'>
                        <div className='w-[40px] h-[40px] bg-[#fff] rounded-[2.963px] absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] z-50' />
                        <div className='w-[29.63px] h-[8.662px] bg-[url(/images/bni-icon.svg)] bg-cover bg-no-repeat absolute top-[15.555px] left-[5.186px] z-[51]' />
                      </div>
                      <span className="h-[30px] grow shrink-0 basis-auto font-['Nunito'] text-[16px] font-normal leading-[30px] text-[#0a0d12] tracking-[-0.32px] relative text-left whitespace-nowrap z-[52]">
                        Bank Negara Indonesia
                      </span>
                      <div
                        className={`w-[24px] h-[24px] shrink-0 rounded-[11998.801px] relative overflow-hidden z-[53] ${
                          selectedPayment === 'Bank Negara Indonesia'
                            ? 'bg-[#c12116]'
                            : 'border border-[#a4a7ae]'
                        }`}
                      >
                        {selectedPayment === 'Bank Negara Indonesia' && (
                          <div className='w-[9.6px] h-[9.6px] bg-[#fff] rounded-[11998.801px] relative overflow-hidden z-[54] mt-[7.2px] ml-[7.2px]' />
                        )}
                      </div>
                    </button>
                    <div className='h-px self-stretch shrink-0 bg-[url(/images/line-payment.svg)] bg-cover bg-no-repeat relative z-[55]' />
                    <button
                      type='button'
                      onClick={() =>
                        setSelectedPayment('Bank Rakyat Indonesia')
                      }
                      className='flex gap-[8px] justify-center items-center self-stretch shrink-0 flex-nowrap relative z-[56] text-left'
                    >
                      <div className='w-[40px] h-[40px] shrink-0 rounded-[8px] border-solid border-[0.74px] border-[#d5d7da] relative box-content overflow-hidden z-[57]'>
                        <div className='w-[40px] h-[40px] bg-[#fff] rounded-[2.963px] absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] z-[58]' />
                        <div className='w-[29.63px] h-[11.215px] bg-[url(/images/bri-icon.svg)] bg-cover bg-no-repeat absolute top-[14.445px] left-[5.187px] z-[59]' />
                      </div>
                      <span className="h-[30px] grow shrink-0 basis-auto font-['Nunito'] text-[16px] font-normal leading-[30px] text-[#0a0d12] tracking-[-0.32px] relative text-left whitespace-nowrap z-[60]">
                        Bank Rakyat Indonesia
                      </span>
                      <div
                        className={`w-[24px] h-[24px] shrink-0 rounded-[11998.801px] relative overflow-hidden z-[61] ${
                          selectedPayment === 'Bank Rakyat Indonesia'
                            ? 'bg-[#c12116]'
                            : 'border border-[#a4a7ae]'
                        }`}
                      >
                        {selectedPayment === 'Bank Rakyat Indonesia' && (
                          <div className='w-[9.6px] h-[9.6px] bg-[#fff] rounded-[11998.801px] relative overflow-hidden mt-[7.2px] ml-[7.2px]' />
                        )}
                      </div>
                    </button>
                    <div className='h-px self-stretch shrink-0 bg-[url(/images/line-payment.svg)] bg-cover bg-no-repeat relative z-[62]' />
                    <button
                      type='button'
                      onClick={() => setSelectedPayment('Bank Central Asia')}
                      className='flex gap-[8px] justify-center items-center self-stretch shrink-0 flex-nowrap relative z-[63] text-left'
                    >
                      <div className='w-[40px] h-[40px] shrink-0 rounded-[2.963px] border-solid border-[0.74px] border-[#d5d7da] relative box-content overflow-hidden z-[64]'>
                        <div className='w-[40px] h-[40px] bg-[#fff] rounded-[2.963px] absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] z-[65]' />
                        <div className='w-[29.63px] h-[9.286px] bg-[url(/images/bca-icon.svg)] bg-cover bg-no-repeat absolute top-[15.186px] left-[5.186px] z-[66]' />
                      </div>
                      <span className="h-[30px] grow shrink-0 basis-auto font-['Nunito'] text-[16px] font-normal leading-[30px] text-[#0a0d12] tracking-[-0.32px] relative text-left whitespace-nowrap z-[67]">
                        Bank Central Asia
                      </span>
                      <div
                        className={`w-[24px] h-[24px] shrink-0 rounded-[11998.801px] relative overflow-hidden z-[68] ${
                          selectedPayment === 'Bank Central Asia'
                            ? 'bg-[#c12116]'
                            : 'border border-[#a4a7ae]'
                        }`}
                      >
                        {selectedPayment === 'Bank Central Asia' && (
                          <div className='w-[9.6px] h-[9.6px] bg-[#fff] rounded-[11998.801px] relative overflow-hidden mt-[7.2px] ml-[7.2px]' />
                        )}
                      </div>
                    </button>
                    <div className='h-px self-stretch shrink-0 bg-[url(/images/line-payment.svg)] bg-cover bg-no-repeat relative z-[69]' />
                    <button
                      type='button'
                      onClick={() => setSelectedPayment('Mandiri')}
                      className='flex gap-[8px] justify-center items-center self-stretch shrink-0 flex-nowrap relative z-[70] text-left'
                    >
                      <div className='w-[40px] h-[40px] shrink-0 rounded-[8px] border-solid border-[0.74px] border-[#d5d7da] relative box-content z-[71]'>
                        <div className='w-[40px] h-[40px] rounded-[2.963px] absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-49.07%] z-[72]' />
                        <div className='w-[29.63px] h-[8.932px] bg-[url(/images/mandiri-icon.svg)] bg-cover bg-no-repeat absolute top-[15.555px] left-[5.185px] z-[73]' />
                      </div>
                      <span className="h-[30px] grow shrink-0 basis-auto font-['Nunito'] text-[16px] font-normal leading-[30px] text-[#0a0d12] tracking-[-0.32px] relative text-left whitespace-nowrap z-[74]">
                        Mandiri
                      </span>
                      <div
                        className={`w-[24px] h-[24px] shrink-0 rounded-[11998.801px] relative overflow-hidden z-[75] ${
                          selectedPayment === 'Mandiri'
                            ? 'bg-[#c12116]'
                            : 'border border-[#a4a7ae]'
                        }`}
                      >
                        {selectedPayment === 'Mandiri' && (
                          <div className='w-[9.6px] h-[9.6px] bg-[#fff] rounded-[11998.801px] relative overflow-hidden mt-[7.2px] ml-[7.2px]' />
                        )}
                      </div>
                    </button>
                  </div>
                </div>
                <div className='w-full h-px shrink-0 bg-[url(/images/dot-line-payment.svg)] bg-cover bg-no-repeat relative z-[76]' />
                {/* Payment summary */}
                <div className='flex w-full pt-0 pr-[20px] pb-0 pl-[20px] flex-col gap-[16px] items-start shrink-0 flex-nowrap relative z-[77]'>
                  <span className="h-[32px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[18px] font-extrabold leading-[32px] text-[#0a0d12] tracking-[-0.36px] relative text-left whitespace-nowrap z-[78]">
                    Payment Summary
                  </span>
                  <div className='flex justify-between items-center self-stretch shrink-0 flex-nowrap relative z-[79]'>
                    <span className="h-[30px] shrink-0 basis-auto font-['Nunito'] text-[16px] font-medium leading-[30px] text-[#0a0d12] tracking-[-0.48px] relative text-left whitespace-nowrap z-[80]">
                      Price (
                      {checkoutData
                        ? checkoutData.groups.reduce(
                            (total, group) =>
                              total +
                              group.items.reduce(
                                (sum, item) => sum + item.quantity,
                                0
                              ),
                            0
                          )
                        : 0}{' '}
                      items)
                    </span>
                    <span className="h-[30px] shrink-0 basis-auto font-['Nunito'] text-[16px] font-bold leading-[30px] text-[#0a0d12] tracking-[-0.32px] relative text-left whitespace-nowrap z-[81]">
                      {formatRupiah(checkoutData ? checkoutData.totalPrice : 0)}
                    </span>
                  </div>
                  <div className='flex justify-between items-center self-stretch shrink-0 flex-nowrap relative z-[82]'>
                    <span className="h-[30px] shrink-0 basis-auto font-['Nunito'] text-[16px] font-medium leading-[30px] text-[#0a0d12] tracking-[-0.48px] relative text-left whitespace-nowrap z-[83]">
                      Delivery Fee
                    </span>
                    <span className="h-[30px] shrink-0 basis-auto font-['Nunito'] text-[16px] font-bold leading-[30px] text-[#0a0d12] tracking-[-0.32px] relative text-left whitespace-nowrap z-[84]">
                      {formatRupiah(10000)}
                    </span>
                  </div>
                  <div className='flex justify-between items-center self-stretch shrink-0 flex-nowrap relative z-[85]'>
                    <span className="h-[30px] shrink-0 basis-auto font-['Nunito'] text-[16px] font-medium leading-[30px] text-[#0a0d12] tracking-[-0.48px] relative text-left whitespace-nowrap z-[86]">
                      Service Fee
                    </span>
                    <span className="h-[30px] shrink-0 basis-auto font-['Nunito'] text-[16px] font-bold leading-[30px] text-[#0a0d12] tracking-[-0.32px] relative text-left whitespace-nowrap z-[87]">
                      {formatRupiah(1000)}
                    </span>
                  </div>
                  <div className='flex justify-between items-center self-stretch shrink-0 flex-nowrap relative z-[88]'>
                    <span className="h-[32px] shrink-0 basis-auto font-['Nunito'] text-[18px] font-normal leading-[32px] text-[#0a0d12] relative text-left whitespace-nowrap z-[89]">
                      Total
                    </span>
                    <span className="h-[32px] shrink-0 basis-auto font-['Nunito'] text-[18px] font-extrabold leading-[32px] text-[#0a0d12] tracking-[-0.36px] relative text-left whitespace-nowrap z-[90]">
                      {formatRupiah(
                        checkoutData
                          ? checkoutData.totalPrice + 10000 + 1000
                          : 0
                      )}
                    </span>
                  </div>
                </div>
                {/* Buy button under payment summary */}
                <button
                  onClick={handleBuy}
                  disabled={isSubmitting}
                  className={`flex h-[48px] pt-[8px] pr-[8px] pb-[8px] pl-[8px] gap-[8px] justify-center items-center w-full shrink-0 flex-nowrap rounded-[100px] relative z-[91] ${
                    isSubmitting
                      ? 'bg-[#a01a12] opacity-80 cursor-not-allowed'
                      : 'bg-[#c12116]'
                  }`}
                >
                  <span className="h-[30px] shrink-0 basis-auto font-['Nunito'] text-[16px] font-bold leading-[30px] text-[#fdfdfd] tracking-[-0.32px] relative text-left whitespace-nowrap z-[92]">
                    {isSubmitting ? 'Processing...' : 'Buy'}
                  </span>
                </button>
                <div className='w-[20px] h-[20px] shrink-0 bg-[url(/images/big-dot.svg)] bg-cover bg-no-repeat rounded-[50%] absolute top-[330px] left-[380px] z-[93]' />
                <div className='w-[20px] h-[20px] shrink-0 bg-[url(/images/big-dot.svg)] bg-cover bg-no-repeat rounded-[50%] absolute top-[330px] left-[-10px] z-[94]' />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}
