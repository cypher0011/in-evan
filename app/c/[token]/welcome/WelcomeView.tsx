'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslations } from '@/lib/i18n/useTranslations';

// Re-create the Link component with motion properties
const MotionLink = motion(Link);

// Define animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
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

// Define the type for the booking prop
type BookingProps = {
  roomImageUrl?: string;
  roomType?: string;
  roomNumber?: string;
} | null;

// Define props for the component
type WelcomeViewProps = {
  token: string;
  guestName: string;
  booking: BookingProps;
};

export default function WelcomeView({
  token,
  guestName,
  booking,
}: WelcomeViewProps) {
  const { t, locale, changeLanguage, isRTL } = useTranslations();

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image with Gradient Overlay */}
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
      <div className="absolute top-6 right-6 z-10">
        <LanguageSwitcher
          currentLanguage={locale}
          onLanguageChange={(language) => changeLanguage(language.code)}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col min-h-screen px-6 py-12 text-white"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.div
          className="mb-1 flex justify-center"
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

        {/* Header Text */}
        <motion.div
          className="flex-1 flex flex-col justify-center max-w-xl"
          variants={itemVariants}
        >
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4">
            {t('welcome.title')}
            <br />
            {guestName},
            <br />
            {t('welcome.to')}
            <br />
            <span className="text-5xl md:text-7xl">{t('welcome.stay')}</span>
          </h1>
          <p className="text-lg text-white/90 mt-4">
            {t('welcome.subtitle')}
          </p>
        </motion.div>

        {/* Room Information Card - Glassmorphism */}
        {booking && (
          <motion.div
            className="backdrop-blur-md bg-white/10 rounded-2xl p-4 mb-8 border border-white/20 shadow-xl"
            variants={itemVariants}
          >
            <div className="flex gap-4 items-center">
              <div className="w-2/5 flex-shrink-0">
                <div className="relative w-full h-32 rounded-xl overflow-hidden">
                  <Image
                    src={booking.roomImageUrl || '/normal_room.jpeg'}
                    alt={booking.roomType || 'Hotel Room'}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className={`flex-1 ${isRTL ? 'text-left' : 'text-right'}`}>
                <p className="text-xs text-white/60 uppercase tracking-wider mb-1">
                  {t('welcome.yourRoom')}
                </p>
                <p className="text-lg font-semibold text-white mb-1">
                  {booking.roomType || 'Double Room'}
                </p>
                <p className="text-4xl font-bold text-white">
                  {booking.roomNumber || '---'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* CTA Button */}
        <motion.div variants={itemVariants}>
          <MotionLink
            href={`/c/${token}/terms`}
            className="block w-full bg-[#F3EFE9] text-gray-900 text-center font-semibold text-lg py-4 rounded-full transition-colors mb-6"
            whileHover={{ scale: 1.03, backgroundColor: '#E8E4DD' }}
            whileTap={{ scale: 0.98 }}
          >
            {t('welcome.checkIn')}
          </MotionLink>
        </motion.div>

        {/* Footer Links */}
        <motion.div
          className="flex justify-between items-center text-sm"
          variants={itemVariants}
        >
          <span className="text-white/70">{t('welcome.needHelp')}</span>
          <MotionLink
            href="#"
            className="text-white font-semibold uppercase tracking-wide"
            whileHover={{ opacity: 0.8 }}
            whileTap={{ opacity: 0.6 }}
          >
            {t('welcome.contactUs')}
          </MotionLink>
        </motion.div>
        {/* Footer - Made by Evan */}
        <motion.div
          className="text-center text-white/50 text-xs tracking-wider"
          variants={itemVariants}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 1.2 } }}
          dangerouslySetInnerHTML={{ __html: t('welcome.madeBy') }}
        />
      </motion.div>
    </div>
  );
}
