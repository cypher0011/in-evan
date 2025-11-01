'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  CheckCircle2,
  Sparkles,
  Calendar,
  DoorOpen,
  ArrowRight,
  Gift,
  Utensils,
  Phone
} from 'lucide-react';
import { useTranslations } from '@/lib/i18n/useTranslations';
import LanguageSwitcher from '@/components/LanguageSwitcher';

type ThanksViewProps = {
  bookingData: {
    confirmationNumber: string;
    roomNumber: string;
    checkIn: string;
    checkOut: string;
    totalPaid?: number;
    guestName: string;
  };
};

export default function ThanksView({ bookingData }: ThanksViewProps) {
  const router = useRouter();
  const { t, locale, changeLanguage, isRTL } = useTranslations();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti animation
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Language Switcher - Always on the right */}
      <div className="fixed top-6 right-6 z-30">
        <LanguageSwitcher currentLanguage={locale} onLanguageChange={(language) => changeLanguage(language.code)} />
      </div>

      {/* Content */}
      <div className="relative flex flex-col min-h-screen px-6 py-12 text-white animate-in fade-in duration-500">
        {/* Logo */}
        <div className="flex justify-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <Image
            src="/movenpick_logo.png"
            alt="Movenpick Hotel"
            width={180}
            height={60}
            priority
            className="object-contain"
          />
        </div>

        {/* Success Icon */}
        <div className="flex justify-center mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="relative animate-in zoom-in-95 duration-600">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-green-400">
              <CheckCircle2 className="w-12 h-12 text-green-400" />
            </div>
            <div className="absolute -top-2 -right-2 animate-pulse">
              <Sparkles className="w-8 h-8 text-amber-400" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto w-full space-y-6">
          {/* Success Message */}
          <div className="text-center space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <h1 className="text-4xl md:text-5xl font-bold text-green-400">
              {t('thanks.title')}
            </h1>
            <p className="text-2xl font-semibold">
              {t('thanks.welcome').replace('{{name}}', bookingData.guestName)}
            </p>
            <p className="text-white/80 text-lg">
              {t('thanks.subtitle')}
            </p>
          </div>

          {/* Booking Confirmation Card */}
          <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <h2 className="text-xl font-bold mb-4 text-center">
              {t('thanks.bookingConfirmation')}
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <p className="text-xs text-white/60 uppercase tracking-wider">{t('thanks.confirmation')}</p>
                <p className="font-bold text-lg">{bookingData.confirmationNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-white/60 uppercase tracking-wider flex items-center gap-1">
                  <DoorOpen className="w-3 h-3" /> {t('thanks.room')}
                </p>
                <p className="font-bold text-lg">{bookingData.roomNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-white/60 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {t('thanks.checkIn')}
                </p>
                <p className="font-semibold">{bookingData.checkIn}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-white/60 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {t('thanks.checkOut')}
                </p>
                <p className="font-semibold">{bookingData.checkOut}</p>
              </div>
            </div>

            {bookingData.totalPaid && bookingData.totalPaid > 0 && (
              <>
                <div className="border-t border-white/20 my-4" />
                <div className="text-center">
                  <p className="text-sm text-white/60 mb-1">{t('thanks.totalPaid')}</p>
                  <p className="text-3xl font-bold text-green-400">
                    {bookingData.totalPaid.toFixed(2)} {t('enhanceStay.sar')}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* What's Next Card */}
          <div className="backdrop-blur-md bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-blue-400/30 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              {t('thanks.whatsNext')}
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p>{t('thanks.directAccess')}</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p>{t('thanks.roomReady')}</p>
              </div>
              <div className="flex items-start gap-3">
                <Utensils className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p>{t('thanks.roomService')}</p>
              </div>
              <div className="flex items-start gap-3">
                <Gift className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <p>{t('thanks.restaurant')}</p>
              </div>
              {/* <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <p>24/7 concierge service available at your convenience</p>
              </div> */}
            </div>
          </div>

          {/* CTA - Guest Portal Access */}
          <div className="pt-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[900ms]">
            <button
              onClick={() => router.push('/guest-app')}
              className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold py-4 px-6 rounded-full hover:from-amber-500 hover:to-orange-600 transition-all duration-300 shadow-xl flex items-center justify-center gap-2 text-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-5 h-5" />
              {t('thanks.accessPortal')}
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* <p className="text-center text-white/70 text-sm">
              Manage your entire stay from one convenient place
            </p> */}
          </div>

          {/* Footer Note */}
          <div className="text-center text-white/60 text-sm pt-6 border-t border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[1100ms]">
            <p>{t('thanks.emailSent')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
