'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Apple, CreditCard, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslations } from '@/lib/i18n/useTranslations';
import LanguageSwitcher from '@/components/LanguageSwitcher';

// --- TYPES ---
type ServiceItem = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number; // Price in SAR
};

type PaymentViewProps = {
  token: string;
  services: ServiceItem[];
};

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
    },
  },
};

// --- MAIN COMPONENT ---
export default function PaymentView({
  token,
  services,
}: PaymentViewProps) {
  const router = useRouter();
  const { t, locale, changeLanguage, isRTL } = useTranslations();

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} ${t('enhanceStay.sar')}`;
  };

  const { subtotal, vat, total } = useMemo(() => {
    const sub = services.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const vatAmount = sub * 0.15;
    return {
      subtotal: sub,
      vat: vatAmount,
      total: sub + vatAmount,
    };
  }, [services]);

  const handlePayment = () => {
    // Mock payment logic - in production, integrate with payment gateway
    console.log('Processing payment...');
    router.push(`/c/${token}/thanks`);
  };

  const hasPayment = total > 0;

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hotel_bg_test.jpeg"
          alt="Hotel Background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Language Switcher - Always on the right */}
      <div className="fixed top-6 right-6 z-20">
        <LanguageSwitcher currentLanguage={locale} onLanguageChange={(language) => changeLanguage(language.code)} />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col min-h-screen px-6 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.div className="flex justify-center mb-8" variants={itemVariants}>
          <Image
            src="/movenpick_logo.png"
            alt="Movenpick Hotel"
            width={180}
            height={60}
            priority
            className="object-contain"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            {hasPayment ? t('payment.titleWithPayment') : t('payment.titleNoPayment')}
          </h1>
          <p className="text-white/80 text-lg">
            {hasPayment ? t('payment.subtitleWithPayment') : t('payment.subtitleNoPayment')}
          </p>
        </motion.div>

        {/* Main Content Area */}
        <div className="w-full max-w-2xl mx-auto space-y-6">
          {hasPayment ? (
            <>
              {/* Order Summary Card */}
              <motion.div
                className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl"
                variants={itemVariants}
              >
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                  {t('payment.orderSummary')}
                </h2>
                <div className="space-y-4">
                  {services.map((item) => (
                    <div key={item.id} className="flex justify-between items-start pb-3 border-b border-white/10 last:border-0 last:pb-0">
                      <div className="flex-1">
                        <p className="font-semibold text-white">{item.name}</p>
                        <p className="text-white/70 text-sm mt-1">{item.description}</p>
                        {item.quantity > 1 && (
                          <p className="text-white/60 text-xs mt-1">{t('payment.quantity')}: {item.quantity}</p>
                        )}
                      </div>
                      <p className="font-bold text-lg ml-4">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="my-4 h-px bg-white/20" />
                <div className="space-y-2">
                  <div className="flex justify-between text-white/80">
                    <p>{t('payment.subtotal')}</p>
                    <p className="font-semibold">{formatCurrency(subtotal)}</p>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <p>{t('payment.vat')}</p>
                    <p className="font-semibold">{formatCurrency(vat)}</p>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-2 border-t border-white/20">
                    <p>{t('payment.total')}</p>
                    <p className="text-amber-300">{formatCurrency(total)}</p>
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div variants={itemVariants} className="space-y-4">
                <h2 className="text-xl font-semibold text-center">{t('payment.paymentMethod')}</h2>

                {/* Apple Pay Button */}
                <motion.button
                  onClick={handlePayment}
                  className="w-full bg-black text-white text-lg font-semibold py-4 rounded-xl flex items-center justify-center gap-2 border-2 border-white/50 shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Apple className="h-7 w-7" />
                  <span>Pay</span>
                </motion.button>

                {/* Divider */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-white/20" />
                  <span className="text-white/60 text-sm">or</span>
                  <div className="flex-1 h-px bg-white/20" />
                </div>

                {/* Card Payment */}
                <button
                  onClick={handlePayment}
                  className="w-full backdrop-blur-md bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold">{t('payment.creditCard')}</p>
                      <p className="text-white/60 text-sm">Visa, Mastercard, Mada</p>
                    </div>
                  </div>
                </button>
              </motion.div>
            </>
          ) : (
            // No Payment Required
            <motion.div
              className="backdrop-blur-md bg-white/10 rounded-2xl p-8 text-center border border-white/20 shadow-xl"
              variants={itemVariants}
            >
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-3">{t('payment.titleNoPayment')}</h2>
              <p className="text-white/80 mb-6 leading-relaxed">
                {t('payment.subtitleNoPayment')}
              </p>
              <motion.button
                onClick={() => router.push(`/c/${token}/thanks`)}
                className="w-full bg-[#F3EFE9] text-gray-900 font-bold py-4 rounded-full hover:bg-[#E8E4DD] transition-all duration-300 shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('payment.completeCheckIn')}
              </motion.button>
            </motion.div>
          )}

          {/* Security Footer */}
          <motion.div
            className="flex items-center justify-center gap-2 mt-8 text-sm text-white/70"
            variants={itemVariants}
          >
            <ShieldCheck className="h-5 w-5 text-green-400" />
            <p>{t('payment.secureNote')}</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
