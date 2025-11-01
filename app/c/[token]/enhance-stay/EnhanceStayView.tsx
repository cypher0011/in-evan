'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Gift,
  X,
  Plus,
  Minus,
} from 'lucide-react';
import { useTranslations } from '@/lib/i18n/useTranslations';
import LanguageSwitcher from '@/components/LanguageSwitcher';

type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

type EnhanceStayViewProps = {
  token: string;
};

export default function EnhanceStayView({ token }: EnhanceStayViewProps) {
  const router = useRouter();
  const { t, locale, changeLanguage, isRTL } = useTranslations();
  const [showGiftPopup, setShowGiftPopup] = useState(true);
  const [selectedServices, setSelectedServices] = useState<Record<string, number>>({});

  // Services data
  const services: Service[] = [
    {
      id: 'flowers',
      name: t('enhanceStay.premiumFlowers'),
      description: t('enhanceStay.flowersDesc'),
      price: 150,
      image: '/flowers_item.jpeg',
      category: 'decoration',
    },
    {
      id: 'spa',
      name: t('enhanceStay.spaWellness'),
      description: t('enhanceStay.spaDesc'),
      price: 500,
      image: '/care_item.jpeg',
      category: 'wellness',
    },
    {
      id: 'transfer',
      name: t('enhanceStay.airportTransfer'),
      description: t('enhanceStay.transferDesc'),
      price: 300,
      image: '/pickfrom_airport.jpeg',
      category: 'transportation',
    },
    // {
    //   id: 'upgrade',
    //   name: 'Room Upgrade',
    //   description: 'Upgrade to our luxurious Deluxe King Room with stunning views',
    //   price: 800,
    //   image: '/delux_room.jpeg',
    //   category: 'accommodation',
    // },
    // {
    //   id: 'checkout',
    //   name: 'Late Checkout',
    //   description: 'Extend your stay until 6 PM and enjoy more time to relax',
    //   price: 200,
    //   image: '/hotel_bg_test.jpeg',
    //   category: 'convenience',
    // },
    // {
    //   id: 'care-package',
    //   name: 'Wellness Package',
    //   description: 'Complete care package with premium amenities and treatments',
    //   price: 450,
    //   image: '/care_item.jpeg',
    //   category: 'wellness',
    // },
  ];

  // Calculate total with memoization for performance
  const { totalItems, totalPrice } = useMemo(() => {
    const items = Object.values(selectedServices).reduce((sum, qty) => sum + qty, 0);
    const price = Object.entries(selectedServices).reduce((sum, [id, qty]) => {
      const service = services.find(s => s.id === id);
      return sum + (service?.price || 0) * qty;
    }, 0);
    return { totalItems: items, totalPrice: price };
  }, [selectedServices, services]);

  const handleAddService = (serviceId: string) => {
    setSelectedServices(prev => ({
      ...prev,
      [serviceId]: (prev[serviceId] || 0) + 1,
    }));
  };

  const handleRemoveService = (serviceId: string) => {
    setSelectedServices(prev => {
      const newQty = (prev[serviceId] || 0) - 1;
      if (newQty <= 0) {
        const { [serviceId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [serviceId]: newQty };
    });
  };

  const handleContinue = () => {
    // TODO: Save selected services to database
    router.push(`/c/${token}/guest-information`);
  };

  const handleSkip = () => {
    router.push(`/c/${token}/guest-information`);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden pb-32">
      {/* Language Switcher - Always on the right */}
      <div className="fixed top-6 right-6 z-20">
        <LanguageSwitcher currentLanguage={locale} onLanguageChange={(language) => changeLanguage(language.code)} />
      </div>

      {/* Gift Popup */}
      {showGiftPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 animate-in fade-in duration-300">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowGiftPopup(false)} />

          {/* Popup Card */}
          <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl max-w-md w-full animate-in zoom-in-95 fade-in duration-500">
            {/* Close Button */}
            <button
              onClick={() => setShowGiftPopup(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Gift Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <Gift className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Text */}
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold text-white">
                {t('enhanceStay.giftTitle')}
              </h2>
              <p className="text-white/80 text-lg leading-relaxed">
                {t('enhanceStay.giftMessage')}
              </p>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => setShowGiftPopup(false)}
              className="mt-8 w-full bg-[#F3EFE9] text-gray-900 font-bold py-4 px-6 rounded-full hover:bg-[#E8E4DD] transition-all duration-300 hover:scale-[1.02] shadow-xl"
            >
              {t('enhanceStay.exploreServices')}
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative flex flex-col min-h-screen px-6 py-12 text-white animate-in fade-in duration-500">
        {/* Logo */}
        <div className="mb-8 flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <Image
            src="/movenpick_logo.png"
            alt="Movenpick Hotel"
            width={180}
            height={60}
            priority
            className="object-contain"
          />
        </div>

        {/* Page Title */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            {t('enhanceStay.title')}
          </h1>
          <p className="text-white/80 text-lg">
            {t('enhanceStay.subtitle')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {services.map((service, index) => {
            const quantity = selectedServices[service.id] || 0;

            return (
              <div
                key={service.id}
                className="group relative h-[400px] overflow-hidden rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: `${300 + index * 150}ms` }}
              >
                {/* Background Image with Hover Zoom */}
                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Gradient Overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                </div>

                {/* Glassmorphic Info Panel */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="backdrop-blur-md bg-white/10 rounded-2xl p-5 border border-white/20 transition-all duration-300 group-hover:bg-white/15">
                    {/* Service Name & Description */}
                    <h3 className="text-xl font-bold text-white mb-2">
                      {service.name}
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed line-clamp-2 mb-4">
                      {service.description}
                    </p>

                    {/* Price & Controls */}
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-amber-300">
                        {service.price} {t('enhanceStay.sar')}
                      </p>

                      {/* Add/Remove Quantity Controls */}
                      {quantity === 0 ? (
                        <button
                          onClick={() => handleAddService(service.id)}
                          className="h-10 px-4 bg-amber-400/20 hover:bg-amber-400 hover:text-black backdrop-blur-sm text-amber-300 font-semibold rounded-full border border-amber-400/50 transition-all duration-300 flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          {t('enhanceStay.add')}
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRemoveService(service.id)}
                            className="h-9 w-9 rounded-full border border-amber-400 bg-transparent text-amber-400 hover:bg-amber-400 hover:text-black transition-all duration-300 flex items-center justify-center"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center text-xl font-bold text-white">
                            {quantity}
                          </span>
                          <button
                            onClick={() => handleAddService(service.id)}
                            className="h-9 w-9 rounded-full border border-amber-400 bg-transparent text-amber-400 hover:bg-amber-400 hover:text-black transition-all duration-300 flex items-center justify-center"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-black/80 backdrop-blur-xl border-t border-white/20 px-6 py-4 animate-in slide-in-from-bottom fade-in duration-500 delay-500">
        <div className="max-w-6xl mx-auto">
          {/* Summary */}
          {totalItems > 0 && (
            <div className="text-white text-center mb-4">
              <p className="text-sm text-white/70">
                {t('enhanceStay.servicesSelected').replace('{{count}}', totalItems.toString())}
              </p>
              <p className="text-2xl font-bold text-amber-300">
                {t('enhanceStay.total')}: {totalPrice} {t('enhanceStay.sar')}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSkip}
              className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-4 px-6 rounded-full border border-white/30 transition-all duration-300"
            >
              {t('enhanceStay.skipForNow')}
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 bg-[#F3EFE9] text-gray-900 font-bold py-4 px-6 rounded-full hover:bg-[#E8E4DD] transition-all duration-300 hover:scale-[1.02] shadow-xl"
            >
              {t('enhanceStay.continue')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
