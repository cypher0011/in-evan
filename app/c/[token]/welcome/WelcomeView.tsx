'use client';

import Link from 'next/link';
import Image from 'next/image';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslations } from '@/lib/i18n/useTranslations';

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
          quality={60}
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          className="object-cover"
        />
        {/* Black gradient from bottom - subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
      </div>

      {/* Language Switcher - Always on the right */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher
          currentLanguage={locale}
          onLanguageChange={(language) => changeLanguage(language.code)}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen px-6 py-12 text-white animate-in fade-in duration-500">
        {/* Logo */}
        <div className="mb-1 flex justify-center animate-in fade-in slide-in-from-top-4 duration-700">
          <Image
            src="/movenpick_logo.png"
            alt="Movenpick Hotel"
            width={180}
            height={60}
            priority
            className="object-contain"
          />
        </div>

        {/* Header Text */}
        <div className="flex-1 flex flex-col justify-center max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
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
        </div>

        {/* Room Information Card - Glassmorphism */}
        {booking && (
          <div className="backdrop-blur-md bg-white/10 rounded-2xl p-4 mb-8 border border-white/20 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <div className="flex gap-4 items-center">
              <div className="w-2/5 flex-shrink-0">
                <div className="relative w-full h-32 rounded-xl overflow-hidden">
                  <Image
                    src={booking.roomImageUrl || '/normal_room.jpeg'}
                    alt={booking.roomType || 'Hotel Room'}
                    fill
                    loading="lazy"
                    quality={75}
                    sizes="(max-width: 768px) 40vw, 30vw"
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
          </div>
        )}

        {/* CTA Button */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <Link
            href={`/c/${token}/terms`}
            className="block w-full bg-[#F3EFE9] text-gray-900 text-center font-semibold text-lg py-4 rounded-full transition-all hover:bg-[#E8E4DD] hover:scale-[1.02] active:scale-[0.98] mb-6"
          >
            {t('welcome.checkIn')}
          </Link>
        </div>

        {/* Footer Links */}
        <div className="flex justify-between items-center text-sm animate-in fade-in duration-700 delay-700">
          <span className="text-white/70">{t('welcome.needHelp')}</span>
          <Link
            href="#"
            className="text-white font-semibold uppercase tracking-wide transition-opacity hover:opacity-80 active:opacity-60"
          >
            {t('welcome.contactUs')}
          </Link>
        </div>
        {/* Footer - Made by Evan */}
        <div
          className="text-center text-white/50 text-xs tracking-wider animate-in fade-in duration-700 delay-1000"
          dangerouslySetInnerHTML={{ __html: t('welcome.madeBy') }}
        />
      </div>
    </div>
  );
}
