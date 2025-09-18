'use client';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatRupiah } from '@/lib/utils';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toast } from 'sonner';
import {
  fetchCart,
  updateCartItem,
  clearCart,
  optimisticUpdateQuantity,
  removeFromCart,
  optimisticRemoveFromCart,
} from '@/store/slices/cartSlice';

export default function Page() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    groups,
    summary,
    loading: isLoading,
    error,
  } = useAppSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const inc = async (cartItemId: number, currentQty: number) => {
    const newQty = currentQty + 1;
    // Immediate UI feedback
    dispatch(optimisticUpdateQuantity({ cartItemId, quantity: newQty }));
    // Then sync with server
    try {
      await dispatch(updateCartItem({ cartItemId, quantity: newQty }));
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };
  const dec = async (cartItemId: number, currentQty: number) => {
    if (currentQty <= 1) return;
    const newQty = currentQty - 1;
    // Immediate UI feedback
    dispatch(optimisticUpdateQuantity({ cartItemId, quantity: newQty }));
    // Then sync with server
    try {
      await dispatch(updateCartItem({ cartItemId, quantity: newQty }));
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };
  const clearAll = async () => {
    await dispatch(clearCart());
  };

  const removeItem = async (cartItemId: number) => {
    if (
      window.confirm(
        'Are you sure you want to remove this item from your cart?'
      )
    ) {
      // Immediate UI feedback
      dispatch(optimisticRemoveFromCart(cartItemId));

      try {
        const result = await dispatch(removeFromCart(cartItemId));
        console.log('Remove result:', result);

        // Check if the action was fulfilled (successful)
        if (result.type === 'cart/removeFromCart/fulfilled') {
          toast.success('Item removed from cart', {
            description: 'The item has been successfully removed.',
          });
        } else if (result.type === 'cart/removeFromCart/rejected') {
          // The action was rejected, show error and revert
          toast.error('Failed to remove item', {
            description: 'Please try again later.',
          });
          // Refetch cart to revert optimistic update
          dispatch(fetchCart());
        }
      } catch (error) {
        console.error('Unexpected error during remove:', error);
        toast.error('Failed to remove item', {
          description: 'Please try again later.',
        });
        // Refetch cart to revert optimistic update
        dispatch(fetchCart());
      }
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className='w-full min-h-screen bg-[#f8f9fa] relative overflow-hidden'>
      {/* Navbar */}
      <Navbar />
      {/* Top spacing to offset fixed navbar */}
      <div className='pt-[60px] sm:pt-[80px] w-full overflow-hidden'>
        <div className='main-container flex w-full max-w-[393px] sm:max-w-[800px] flex-col gap-[32px] items-center flex-nowrap relative mx-auto my-0 px-4'>
          {/* Page title */}
          <span className="h-[42px] w-full basis-auto font-['Nunito'] sm:text-[32px] text-[24px] font-extrabold leading-[42px] text-[#0a0d12] relative text-left whitespace-nowrap">
            My Cart
          </span>
          {/* Loading / Error */}
          {isLoading && (
            <div className="text-[#0a0d12] font-['Nunito'] text-[14px]">
              Loading cart...
            </div>
          )}
          {error && !isLoading && (
            <div className="text-[#c12116] font-['Nunito'] text-[14px]">
              {error}
            </div>
          )}

          {/* API-backed cart groups */}
          {groups.map((g, gi) => (
            <div
              key={gi}
              className='flex p-[16px] flex-col gap-[16px] items-start w-[361px] h-[372px] sm:w-full sm:h-auto shrink-0 flex-nowrap bg-[#fff] rounded-[16px] relative shadow-[0_0_20px_0_rgba(202,201,201,0.25)] z-40'
            >
              <div className='flex w-full gap-[8px] items-center shrink-0 flex-nowrap relative z-[41]'>
                <div className='w-[32px] h-[32px] shrink-0 rounded-[8px] relative z-[42] overflow-hidden'>
                  <Image
                    src={g.restaurant.logo || '/images/store.png'}
                    alt={g.restaurant.name}
                    fill
                    className='object-cover'
                    sizes='32px'
                  />
                </div>
                <span className="h-[32px] shrink-0 basis-auto font-['Nunito'] text-[18px] font-bold leading-[32px] text-[#0a0d12] tracking-[-0.54px] relative text-left whitespace-nowrap z-[43]">
                  {g.restaurant.name}
                </span>
                <div className='w-[24px] h-[24px] shrink-0 bg-[url(/images/panah-kanan.svg)]  bg-cover bg-no-repeat relative overflow-hidden z-[44]' />
              </div>

              {g.items.map((it) => (
                <div
                  key={it.id}
                  className='flex justify-between items-center self-stretch shrink-0 flex-nowrap relative z-[45]'
                >
                  <div className='flex gap-[12px] items-center shrink-0 flex-1 min-w-0 relative z-[46]'>
                    <div className='w-[64px] h-[64px] shrink-0 rounded-[12px] relative z-[47] overflow-hidden'>
                      <Image
                        src={it.menu.image}
                        alt={it.menu.foodName}
                        fill
                        className='object-cover'
                        sizes='64px'
                      />
                    </div>
                    <div className='flex flex-1 min-w-0 flex-col items-start shrink-0 flex-nowrap relative z-[48]'>
                      <span className="h-[24px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[14px] font-medium leading-[24px] text-[#0a0d12] tracking-[-0.28px] relative text-left whitespace-nowrap z-[49]">
                        {it.menu.foodName}
                      </span>
                      <span className="h-[28px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[16px] font-extrabold leading-[28px] text-[#0a0d12] relative text-left whitespace-nowrap z-50">
                        {formatRupiah(it.menu.price)}
                      </span>
                    </div>
                  </div>
                  <div className='flex pt-[12px] pr-0 pb-[12px] pl-0 gap-[12px] justify-end items-center shrink-0 flex-nowrap relative z-[51]'>
                    <div className='flex w-[108px] gap-[12px] items-center shrink-0 flex-nowrap relative z-[52]'>
                      <button
                        onClick={() => dec(it.id, it.quantity)}
                        className='flex w-[36px] pt-[6px] pr-[6px] pb-[6px] pl-[6px] gap-[6px] items-center shrink-0 flex-nowrap rounded-[1000px] border-solid border border-[#d5d7da] relative z-[53]'
                      >
                        <div className='w-[20px] h-[20px] shrink-0 bg-[url(/images/minus.svg)]  bg-cover bg-no-repeat relative overflow-hidden z-[54]' />
                      </button>
                      <span className="h-[28px] shrink-0 basis-auto font-['Nunito'] text-[16px] font-semibold leading-[28px] text-[#0a0d12] tracking-[-0.24px] relative text-left whitespace-nowrap z-[55]">
                        {it.quantity}
                      </span>
                      <button
                        onClick={() => inc(it.id, it.quantity)}
                        className='flex w-[36px] pt-[6px] pr-[6px] pb-[6px] pl-[6px] gap-[6px] items-center shrink-0 flex-nowrap bg-[#c12116] rounded-[1000px] relative z-[56]'
                      >
                        <div className='w-[20px] h-[20px] shrink-0 bg-[url(/images/plus.svg)] bg-cover bg-no-repeat relative overflow-hidden z-[57]' />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(it.id)}
                      className='flex w-[36px] h-[36px] pt-[6px] pr-[6px] pb-[6px] pl-[6px] gap-[6px] items-center shrink-0 flex-nowrap rounded-[1000px] border-solid border border-[#dc2626] relative z-[58] hover:bg-[#fef2f2] transition-colors'
                      title='Remove item'
                    >
                      <span className="w-[20px] h-[20px] shrink-0 font-['Nunito'] text-[16px] font-bold text-[#dc2626] flex items-center justify-center z-[59]">
                        ×
                      </span>
                    </button>
                  </div>
                </div>
              ))}

              <div className='h-px self-stretch shrink-0 bg-[url(/images/dot-line.svg)] bg-cover bg-no-repeat relative z-[71]' />
              <div className='flex flex-col sm:flex-row justify-between items-stretch sm:items-center self-stretch shrink-0 flex-nowrap gap-[12px] relative z-[72]'>
                <div className='flex w-[223px] flex-col gap-[-4px] items-start shrink-0 flex-nowrap relative z-[73]'>
                  <span className="h-[26px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[14px] font-medium leading-[26px] text-[#0a0d12] tracking-[-0.28px] relative text-left whitespace-nowrap z-[74]">
                    Total
                  </span>
                  <span className="h-[30px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[18px] font-extrabold leading-[30px] text-[#0a0d12] relative text-left whitespace-nowrap z-[75]">
                    {formatRupiah(g.subtotal)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className='w-full sm:w-[240px]'
                >
                  <div className='flex w-full h-[44px] sm:h-[48px] pt-[8px] pr-[8px] pb-[8px] pl-[8px] gap-[8px] justify-center items-center shrink-0 flex-nowrap bg-[#c12116] rounded-[100px] relative z-[76]'>
                    <span className="h-[28px] shrink-0 basis-auto font-['Nunito'] text-[15px] font-bold leading-[28px] text-[#fdfdfd] tracking-[-0.3px] relative text-left whitespace-nowrap z-[77]">
                      Checkout
                    </span>
                  </div>
                </button>
              </div>
            </div>
          ))}

          {/* Order summary */}
          {groups.length > 0 && (
            <div className='flex p-[16px] flex-col gap-[16px] items-start w-[361px] sm:w-full shrink-0 flex-nowrap bg-[#fff] rounded-[16px] relative shadow-[0_0_20px_0_rgba(202,201,201,0.25)] z-40'>
              <div className='flex w-[168px] gap-[8px] items-center shrink-0 flex-nowrap relative z-[41]'>
                <div className='w-[32px] h-[32px] shrink-0 bg-[url(/images/cart-icon.png)] bg-cover bg-no-repeat relative z-[42]' />
                <span className="h-[32px] shrink-0 basis-auto font-['Nunito'] text-[18px] font-bold leading-[32px] text-[#0a0d12] tracking-[-0.54px] relative text-left whitespace-nowrap z-[43]">
                  Order Summary
                </span>
                <div className='w-[24px] h-[24px] shrink-0 bg-[url(/images/panah-kanan.svg)] bg-cover bg-no-repeat relative overflow-hidden z-[44]' />
              </div>
              <div className='flex justify-between items-center self-stretch shrink-0 flex-nowrap relative z-[45]'>
                <div className='flex gap-[12px] items-center shrink-0 flex-1 min-w-0 relative z-[46]'>
                  <div className='w-[64px] h-[64px] shrink-0 rounded-[12px] relative z-[47] overflow-hidden'>
                    <Image
                      src={
                        groups[0]?.items?.[0]?.menu?.image ||
                        '/images/burger4.png'
                      }
                      alt={groups[0]?.items?.[0]?.menu?.foodName || 'Menu item'}
                      fill
                      className='object-cover'
                      sizes='64px'
                    />
                  </div>
                  <div className='flex flex-1 min-w-0 flex-col items-start shrink-0 flex-nowrap relative z-[48]'>
                    <span className="h-[24px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[14px] font-medium leading-[24px] text-[#0a0d12] tracking-[-0.28px] relative text-left whitespace-nowrap z-[49]">
                      Total Price
                    </span>
                    <span className="h-[28px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[16px] font-extrabold leading-[28px] text-[#0a0d12] relative text-left whitespace-nowrap z-50">
                      {formatRupiah(summary.totalPrice)}
                    </span>
                  </div>
                </div>
                <div className='flex pt-[12px] pr-0 pb-[12px] pl-0 gap-[12px] justify-end items-center shrink-0 flex-nowrap relative z-[51]'>
                  <div className='flex w-[108px] gap-[12px] items-center shrink-0 flex-nowrap relative z-[52]'>
                    <button
                      onClick={clearAll}
                      className='flex w-[112px] h-[36px] items-center justify-center rounded-[100px] border border-[#d5d7da]'
                    >
                      <span className="font-['Nunito'] text-[14px] font-bold text-[#0a0d12]">
                        Clear Cart
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className='h-px self-stretch shrink-0 bg-[url(/images/dot-line.svg)] bg-cover bg-no-repeat relative z-[71]' />
              <div className='flex flex-col sm:flex-row justify-between items-stretch sm:items-center self-stretch shrink-0 flex-nowrap gap-[12px] relative z-[72]'>
                <div className='flex w-[223px] flex-col gap-[-4px] items-start shrink-0 flex-nowrap relative z-[73]'>
                  <span className="h-[26px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[14px] font-medium leading-[26px] text-[#0a0d12] tracking-[-0.28px] relative text-left whitespace-nowrap z-[74]">
                    Total
                  </span>
                  <span className="h-[30px] self-stretch shrink-0 basis-auto font-['Nunito'] text-[18px] font-extrabold leading-[30px] text-[#0a0d12] relative text-left whitespace-nowrap z-[75]">
                    {formatRupiah(summary.totalPrice)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className='w-full sm:w-[240px]'
                >
                  <div className='flex w-full h-[44px] sm:h-[48px] pt-[8px] pr-[8px] pb-[8px] pl-[8px] gap-[8px] justify-center items-center shrink-0 flex-nowrap bg-[#c12116] rounded-[100px] relative z-[76]'>
                    <span className="h-[28px] shrink-0 basis-auto font-['Nunito'] text-[15px] font-bold leading-[28px] text-[#fdfdfd] tracking-[-0.3px] relative text-left whitespace-nowrap z-[77]">
                      Checkout
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
