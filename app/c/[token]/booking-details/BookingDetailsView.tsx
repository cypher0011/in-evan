'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Users, Moon, Sparkles } from 'lucide-react';
import { useTranslations } from '@/lib/i18n/useTranslations';
import LanguageSwitcher from '@/components/LanguageSwitcher';

type BookingData = {
  bookingId: string;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: string;
  roomType?: string;
  roomImageUrl?: string;
};

type BookingDetailsViewProps = {
  token: string;
  booking: BookingData;
};

// Animation variants matching welcome page
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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

export default function BookingDetailsView({
  token,
  booking,
}: BookingDetailsViewProps) {
  const router = useRouter();
  const { t, locale, changeLanguage, isRTL } = useTranslations();

  const handleContinue = () => {
    router.push(`/c/${token}/enhance-stay`);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image with Gradient Overlay - Same as welcome page */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hotel_bg_test.jpeg"
          alt="Hotel Background"
          fill
          priority
          className="object-cover"
        />
        {/* Black gradient from bottom - subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
      </div>

      {/* Language Switcher - Always on the right */}
      <div className="fixed top-6 right-6 z-20">
        <LanguageSwitcher currentLanguage={locale} onLanguageChange={(language) => changeLanguage(language.code)} />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col min-h-screen px-6 py-12 text-white"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo - Same as welcome page */}
        <motion.div
          className="mb-8 flex justify-center"
          variants={itemVariants}
        >
          <Image
            src="/movenpick_logo.png"
            alt="Movenpick Hotel"
            width={180}
            height={60}
            priority
            className="object-contain"
          />
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full space-y-6">
          {/* Page Title */}
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {t('bookingDetails.title')}
            </h1>
            <p className="text-white/80 text-lg">
              {t('bookingDetails.subtitle')}
            </p>
          </motion.div>

          {/* Booking Details Card - Glassmorphism */}
          <motion.div
            className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl space-y-4"
            variants={itemVariants}
          >
            {/* Booking ID Pill */}
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
              <span className="text-sm font-semibold tracking-wide">
                ID: {booking.bookingId}
              </span>
            </div>

            {/* Hotel Name */}
            <div>
              <p className="text-sm text-white/60 uppercase tracking-wider mb-1">
                {t('bookingDetails.hotel')}
              </p>
              <p className="text-xl font-bold">{booking.hotelName}</p>
            </div>

            {/* Divider */}
            <div className="border-t border-white/20 my-4" />

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Check-in */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white/60">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">{t('bookingDetails.checkIn')}</span>
                </div>
                <p className="text-lg font-semibold">{booking.checkIn}</p>
              </div>

              {/* Check-out */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white/60">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">{t('bookingDetails.checkOut')}</span>
                </div>
                <p className="text-lg font-semibold">{booking.checkOut}</p>
              </div>

              {/* Nights */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white/60">
                  <Moon className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">{t('bookingDetails.nights')}</span>
                </div>
                <p className="text-lg font-semibold">{booking.nights}</p>
              </div>

              {/* Guests */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white/60">
                  <Users className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">{t('bookingDetails.guests')}</span>
                </div>
                <p className="text-lg font-semibold">{booking.guests}</p>
              </div>
            </div>
          </motion.div>

          {/* Upgrade Offer Card - Enhanced Design */}
          <motion.div
            className="backdrop-blur-md bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl p-1 border border-amber-400/30 shadow-xl overflow-hidden"
            variants={itemVariants}
          >
            <div className="relative bg-black/30 backdrop-blur-sm rounded-xl overflow-hidden">
              {/* Premium Badge */}
              <div className="absolute top-3 right-3 z-10 bg-amber-400 text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Upgrade
              </div>

              {/* Image */}
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src="/delux_room.jpeg"
                  alt="Deluxe King Room"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative p-5 space-y-3">
                <h3 className="text-2xl font-bold text-white">
                  {t('bookingDetails.upgradeTitle')}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  {t('bookingDetails.upgradeDescription')}
                </p>

                {/* CTA Button */}
                <button
                  className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-full border border-white/30 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                  onClick={() => {
                    // TODO: Handle upgrade selection
                    console.log('View upgrade details');
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  {t('bookingDetails.viewDetails')}
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Continue Button - Same style as welcome page */}
        <motion.div variants={itemVariants} className="pt-8">
          <button
            onClick={handleContinue}
            className="block w-full bg-[#F3EFE9] text-gray-900 text-center font-semibold text-lg py-4 rounded-full transition-all duration-300 hover:bg-[#E8E4DD] hover:scale-[1.02] shadow-xl"
          >
            {t('bookingDetails.continue')}
          </button>
        </motion.div>

        {/* Footer - Made by Evan */}
        <motion.div
          className="text-center text-white/50 text-xs tracking-wider mt-6"
          variants={itemVariants}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 1.2 } }}
        >
          Made with ❤️ by <span className="text-white font-semibold">Evan</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
