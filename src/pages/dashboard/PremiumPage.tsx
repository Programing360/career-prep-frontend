import { useState, useEffect } from 'react';
import {
  Crown,
  Zap,
  Check,
  CreditCard,
  Shield,
  XIcon,
  Infinity as InfinityIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SubscriptionTier, TokenPack } from '@/types/premium';
import { paymentService } from '@/services/paymentService';

const tiers: {
  tier: SubscriptionTier;
  name: string;
  subtitle: string;
  monthlyPrice: number | null;
  yearlyPrice?: number;
  icon: typeof Crown;
  badge?: string;
  features: { text: string; included: boolean }[];
}[] = [
  {
    tier: 'free',
    name: 'Starter',
    subtitle: 'Unleash the power of automation.',
    monthlyPrice: null,
    icon: Zap,
    features: [
      { text: '50 MCQs per day', included: true },
      { text: '5 AI tokens per day', included: true },
      { text: '1 mock test per week', included: true },
      { text: 'Basic analytics', included: true },
      { text: 'AI Tutor access', included: false },
      { text: 'Advanced analytics', included: false },
    ],
  },
  {
    tier: 'pro',
    name: 'Professional',
    subtitle: 'Advanced tools to take your work to the next level.',
    monthlyPrice: 9.99,
    yearlyPrice: 79.99,
    icon: Crown,
    features: [
      { text: '200 MCQs per day', included: true },
      { text: '50 AI tokens per day', included: true },
      { text: 'Unlimited mock tests', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'AI Tutor access', included: true },
      { text: 'Detailed subject breakdown', included: true },
    ],
  },
  {
    tier: 'lifetime',
    name: 'Company',
    subtitle: 'Automation plus enterprise-grade features.',
    monthlyPrice: 49.99,
    icon: InfinityIcon,
    badge: 'MOST POPULAR',
    features: [
      { text: 'Unlimited MCQs per day', included: true },
      { text: 'Unlimited AI tokens per day', included: true },
      { text: 'Unlimited mock tests', included: true },
      { text: 'Full analytics suite', included: true },
      { text: 'AI Tutor access', included: true },
      { text: 'Detailed subject breakdown', included: true },
      { text: 'Priority support', included: true },
      { text: 'One-time payment', included: true },
    ],
  },
];

const tokenPacks: TokenPack[] = [
  {
    id: 'pack-500',
    name: 'Starter Pack',
    tokens: 500,
    price: 2.99,
    currency: 'USD',
  },
  {
    id: 'pack-2000',
    name: 'Power Pack',
    tokens: 2000,
    price: 8.99,
    currency: 'USD',
    originalPrice: 11.96,
    badge: 'Save 25%',
  },
  {
    id: 'pack-5000',
    name: 'Mega Pack',
    tokens: 5000,
    price: 19.99,
    currency: 'USD',
    originalPrice: 29.9,
    badge: 'Save 33%',
  },
  {
    id: 'daily-pass',
    name: 'Unlimited Daily Pass',
    tokens: -1,
    price: 1.49,
    currency: 'USD',
    badge: '1 Day',
  },
];

export default function PremiumPage() {
  const [initialPayment] = useState(() => {
    if (typeof window === 'undefined') return null;
    const query = new URLSearchParams(window.location.search);
    if (query.get('canceled')) return { canceled: true };
    if (query.get('success')) {
      return {
        success: true,
        type: (query.get('type') as 'subscription' | 'token') || 'subscription',
        tier: query.get('tier') as SubscriptionTier,
        transactionId:
          query.get('session_id') ||
          `TXN-${Date.now().toString(36).toUpperCase()}`,
      };
    }
    return null;
  });

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    'monthly'
  );
  const [modalOpen, setModalOpen] = useState(Boolean(initialPayment));
  const [modalContext, setModalContext] = useState<{
    type: 'subscription' | 'token';
    tier?: SubscriptionTier;
    pack?: TokenPack;
  } | null>(
    initialPayment?.success
      ? { type: initialPayment.type, tier: initialPayment.tier || 'pro' }
      : null
  );
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(
    Boolean(initialPayment?.success)
  );
  const [paymentCanceled, setPaymentCanceled] = useState(
    Boolean(initialPayment?.canceled)
  );
  const [transactionId, setTransactionId] = useState(
    initialPayment?.transactionId || ''
  );

  // Scroll lock & Escape key handling for Modal
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCloseModal();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalOpen]);

  // Handle Stripe Success/Cancel Callback Redirect
  useEffect(() => {
    if (modalOpen) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [modalOpen]);

  function handleSubscribe(tier: SubscriptionTier) {
    setModalContext({ type: 'subscription', tier });
    setModalOpen(true);
    setPaymentSuccess(false);
    setPaymentCanceled(false);
  }

  function handleBuyTokens(pack: TokenPack) {
    setModalContext({ type: 'token', pack });
    setModalOpen(true);
    setPaymentSuccess(false);
    setPaymentCanceled(false);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setModalContext(null);
    setPaymentSuccess(false);
    setPaymentCanceled(false);
    setTransactionId('');
  }

  async function handlePayment() {
    if (!modalContext) return;
    setProcessing(true);

    try {
      const type = modalContext.type;
      const itemId =
        type === 'subscription' ? modalContext.tier : modalContext.pack?.id;

      if (!itemId) throw new Error('Item ID missing');

      const checkoutUrl = await paymentService.createCheckoutSession(
        type,
        itemId
      );
      console.log(checkoutUrl);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Stripe checkout failed:', error);
      setProcessing(false);
    }
  }

  const getPrice = (t: (typeof tiers)[number]) => {
    if (!t.monthlyPrice) return null;
    return billingCycle === 'yearly' && t.yearlyPrice
      ? t.yearlyPrice
      : t.monthlyPrice;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f5fd] via-[#f3ecf8] to-[#e8ddf5] p-6 md:p-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Header & Toggle */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#231b42] dark:text-white">
              Plans & Pricing
            </h1>
            <p className="mt-3 max-w-md text-base text-[#736c8d] dark:text-slate-400">
              Select a plan to unlock full AI capabilities and unlimited
              practice.
            </p>
          </div>

          <div className="rounded-full bg-white/70 p-1.5 shadow-sm backdrop-blur-md dark:bg-slate-800/80">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={cn(
                  'rounded-full px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all',
                  billingCycle === 'monthly'
                    ? 'bg-[#b066ea] text-white shadow-md'
                    : 'text-[#8b84a6] hover:text-[#231b42] dark:text-slate-400 dark:hover:text-white'
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={cn(
                  'rounded-full px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all',
                  billingCycle === 'yearly'
                    ? 'bg-[#b066ea] text-white shadow-md'
                    : 'text-[#8b84a6] hover:text-[#231b42] dark:text-slate-400 dark:hover:text-white'
                )}
              >
                Yearly
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="relative rounded-[32px] border border-white/40 bg-white/60 p-6 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60 md:p-10">
          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-3">
            {tiers.map((t) => {
              const price = getPrice(t);
              const isPopular = t.badge === 'MOST POPULAR';

              return (
                <div
                  key={t.tier}
                  className={cn(
                    'relative flex flex-col justify-between rounded-2xl p-6 transition-transform duration-300 md:p-8',
                    isPopular
                      ? 'bg-[#1c1a40] text-white shadow-2xl dark:bg-[#151333] lg:-translate-y-4'
                      : 'bg-transparent text-[#231b42] dark:text-slate-200'
                  )}
                >
                  {isPopular && (
                    <div className="absolute right-6 top-6 rounded-full bg-[#5d3099] px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#d5a8ff]">
                      {t.badge}
                    </div>
                  )}

                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold tracking-tight">
                        {price !== null ? `$${price}` : 'Free'}
                      </span>
                      {price !== null && (
                        <span
                          className={cn(
                            'text-sm font-medium',
                            isPopular ? 'text-slate-400' : 'text-[#736c8d]'
                          )}
                        >
                          /{billingCycle === 'yearly' ? 'year' : 'month'}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-4 text-2xl font-bold">{t.name}</h3>
                    <p
                      className={cn(
                        'mt-2 text-xs leading-relaxed',
                        isPopular
                          ? 'text-slate-300'
                          : 'text-[#736c8d] dark:text-slate-400'
                      )}
                    >
                      {t.subtitle}
                    </p>

                    <ul className="mt-8 space-y-3.5">
                      {t.features.map((f) => (
                        <li
                          key={f.text}
                          className="flex items-center gap-3 text-xs font-semibold"
                        >
                          <div
                            className={cn(
                              'flex h-4 w-4 shrink-0 items-center justify-center rounded-full',
                              isPopular ? 'text-white' : 'text-[#aa78df]'
                            )}
                          >
                            <Check size={14} strokeWidth={3} />
                          </div>
                          <span
                            className={
                              f.included ? '' : 'line-through opacity-50'
                            }
                          >
                            {f.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    disabled={t.tier === 'free'}
                    onClick={() => t.tier !== 'free' && handleSubscribe(t.tier)}
                    className={cn(
                      'mt-8 w-full rounded-full py-3.5 text-sm font-bold shadow-md transition-all',
                      isPopular
                        ? 'bg-[#b066ea] text-white hover:bg-[#9f51d9]'
                        : 'bg-[#988cae]/30 text-[#675c82] hover:bg-[#988cae]/50 dark:bg-slate-800 dark:text-slate-200'
                    )}
                  >
                    {t.tier === 'free' ? 'Current Plan' : 'Choose plan'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Token Packs Section */}
        <div className="rounded-[28px] border border-white/40 bg-white/60 p-6 shadow-lg backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60 md:p-8">
          <div className="flex items-center gap-3">
            <Zap size={22} className="text-[#b066ea]" />
            <h2 className="text-xl font-bold text-[#231b42] dark:text-white">
              AI Token Packs
            </h2>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tokenPacks.map((pack) => (
              <div
                key={pack.id}
                className="relative flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all dark:border-slate-700 dark:bg-slate-800"
              >
                {pack.badge && (
                  <span className="absolute right-3 top-3 rounded-full bg-[#b066ea]/15 px-2.5 py-0.5 text-[9px] font-bold text-[#b066ea]">
                    {pack.badge}
                  </span>
                )}
                <div>
                  <h3 className="text-sm font-bold text-[#231b42] dark:text-white">
                    {pack.name}
                  </h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-[#231b42] dark:text-white">
                      {pack.tokens === -1 ? '∞' : pack.tokens.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold text-[#736c8d]">
                      tokens
                    </span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-base font-bold text-[#b066ea]">
                      ${pack.price}
                    </span>
                    {pack.originalPrice && (
                      <span className="text-[10px] text-slate-400 line-through">
                        ${pack.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleBuyTokens(pack)}
                  className="mt-4 w-full rounded-full bg-[#f2eafb] py-2 text-xs font-bold text-[#b066ea] hover:bg-[#e6d5f7] dark:bg-slate-700 dark:text-indigo-300"
                >
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Window */}
        {modalOpen && modalContext && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-[#1c1a40]/60 backdrop-blur-sm"
              onClick={handleCloseModal}
            />
            <div className="relative w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
              <button
                onClick={handleCloseModal}
                className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <XIcon size={18} />
              </button>

              {paymentSuccess ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f2eafb] text-[#b066ea]">
                    <Check size={32} strokeWidth={3} />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-[#231b42] dark:text-white">
                    Payment Successful!
                  </h3>
                  <p className="mt-2 text-xs text-[#736c8d] dark:text-slate-400">
                    {modalContext.type === 'subscription'
                      ? `You are now on the ${modalContext.tier?.toUpperCase()} plan.`
                      : `${modalContext.pack?.tokens === -1 ? 'Unlimited' : modalContext.pack?.tokens.toLocaleString()} tokens added!`}
                  </p>
                  <p className="mt-3 text-[10px] text-slate-400">
                    Transaction ID: {transactionId}
                  </p>
                  <button
                    className="mt-6 w-full rounded-full bg-[#b066ea] py-3 text-xs font-bold text-white hover:bg-[#9f51d9]"
                    onClick={handleCloseModal}
                  >
                    Done
                  </button>
                </div>
              ) : paymentCanceled ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-500 dark:bg-amber-500/20">
                    <XIcon size={28} strokeWidth={3} />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-[#231b42] dark:text-white">
                    Payment Cancelled
                  </h3>
                  <p className="mt-2 text-xs text-[#736c8d] dark:text-slate-400">
                    Your payment was cancelled. No charges were made to your
                    account.
                  </p>
                  <button
                    className="mt-6 w-full rounded-full bg-[#b066ea] py-3 text-xs font-bold text-white hover:bg-[#9f51d9]"
                    onClick={handleCloseModal}
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f2eafb] text-[#b066ea]">
                      <CreditCard size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-[#231b42] dark:text-white">
                      Checkout with Stripe
                    </h3>
                  </div>

                  <div className="mt-4 rounded-2xl bg-[#f8f5fd] p-4 dark:bg-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#736c8d] dark:text-slate-400">
                        {modalContext.type === 'subscription'
                          ? `${modalContext.tier?.toUpperCase()} Plan (${billingCycle})`
                          : modalContext.pack?.name}
                      </span>
                      <span className="text-base font-extrabold text-[#231b42] dark:text-white">
                        $
                        {modalContext.type === 'subscription'
                          ? getPrice(
                              tiers.find((t) => t.tier === modalContext.tier)!
                            )
                          : modalContext.pack?.price}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                    <Shield size={16} className="shrink-0 text-[#b066ea]" />
                    <p className="text-[10px] text-[#736c8d] dark:text-slate-400">
                      Redirecting to Stripe's end-to-end encrypted checkout
                      portal.
                    </p>
                  </div>

                  <button
                    disabled={processing}
                    onClick={handlePayment}
                    className="mt-6 w-full rounded-full bg-[#b066ea] py-3.5 text-xs font-bold text-white shadow-lg transition-all hover:bg-[#9f51d9] disabled:opacity-50"
                  >
                    {processing ? 'Redirecting...' : 'Proceed to Checkout'}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
