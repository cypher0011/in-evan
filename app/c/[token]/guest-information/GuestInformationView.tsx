'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CheckCircle2, User, Phone, DoorOpen, Mail, Calendar, Globe, IdCard } from 'lucide-react';
import NationalitySelector from '@/components/NationalitySelector';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslations } from '@/lib/i18n/useTranslations';

type GuestData = {
  firstName: string;
  lastName: string;
  phone: string;
  roomNumber: string;
};

type GuestInformationViewProps = {
  token: string;
  guestData: GuestData;
};

type FormData = {
  email: string;
  dateOfBirth: string;
  nationality: string;
  idType: 'iqama' | 'passport' | 'national_id' | '';
  idNumber: string;
  specialRequests: string;
};

type FormErrors = {
  [K in keyof FormData]?: string;
};

export default function GuestInformationView({
  token,
  guestData,
}: GuestInformationViewProps) {
  const router = useRouter();
  const { t, locale, changeLanguage, isRTL } = useTranslations();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    dateOfBirth: '',
    nationality: '',
    idType: '',
    idNumber: '',
    specialRequests: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = t('guestInfo.errors.dateOfBirthRequired');
    }

    if (!formData.nationality) {
      newErrors.nationality = t('guestInfo.errors.nationalityRequired');
    }

    if (!formData.idType) {
      newErrors.idType = t('guestInfo.errors.idTypeRequired');
    }

    if (!formData.idNumber) {
      newErrors.idNumber = t('guestInfo.errors.idNumberRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      // TODO: Save guest information to database
      router.push(`/c/${token}/payment`);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden pb-32">
      {/* Language Switcher - Always on the right */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher
          currentLanguage={locale}
          onLanguageChange={(language) => changeLanguage(language.code)}
        />
      </div>

      {/* Content */}
      <div className="relative flex flex-col min-h-screen px-6 py-12 text-white animate-in fade-in duration-500">
        {/* Logo */}
        <div className="mb-8 flex justify-center animate-in fade-in slide-in-from-top-4 duration-700">
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
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            {t('guestInfo.title')}
          </h1>
          <p className="text-white/80 text-lg">
            {t('guestInfo.subtitle')}
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto w-full space-y-6">
          {/* Confirmed Details Section */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
              {t('guestInfo.confirmedDetails')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="backdrop-blur-md bg-white/10 rounded-2xl p-4 border border-white/20 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-white/60 uppercase tracking-wider">{t('guestInfo.firstName')}</p>
                    <p className="text-lg font-semibold">{guestData.firstName}</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
              </div>

              {/* Last Name */}
              <div className="backdrop-blur-md bg-white/10 rounded-2xl p-4 border border-white/20 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-white/60 uppercase tracking-wider">{t('guestInfo.lastName')}</p>
                    <p className="text-lg font-semibold">{guestData.lastName}</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
              </div>

              {/* Phone */}
              <div className="backdrop-blur-md bg-white/10 rounded-2xl p-4 border border-white/20 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-white/60 uppercase tracking-wider">{t('guestInfo.phone')}</p>
                    <p className="text-lg font-semibold">{guestData.phone}</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
              </div>

              {/* Room Number */}
              <div className="backdrop-blur-md bg-white/10 rounded-2xl p-4 border border-white/20 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <DoorOpen className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-white/60 uppercase tracking-wider">{t('guestInfo.room')}</p>
                    <p className="text-lg font-semibold">{guestData.roomNumber}</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information Form */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <h2 className="text-xl font-bold mb-4">{t('guestInfo.additionalInfo')}</h2>
            <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl space-y-6">

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white/90 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {t('guestInfo.email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-amber-400 focus:bg-white/10 transition-all duration-300"
                  placeholder={t('guestInfo.emailPlaceholder')}
                />
              </div>

              {/* Date of Birth & Nationality */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/90 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {t('guestInfo.dateOfBirth')} {t('guestInfo.required')}
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/5 border ${
                      errors.dateOfBirth ? 'border-red-400' : 'border-white/20'
                    } rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-amber-400 focus:bg-white/10 transition-all duration-300`}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-400 text-xs mt-1">{errors.dateOfBirth}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/90 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    {t('guestInfo.nationality')} {t('guestInfo.required')}
                  </label>
                  <NationalitySelector
                    value={formData.nationality}
                    onChange={(value) => {
                      setFormData(prev => ({ ...prev, nationality: value }));
                      if (errors.nationality) {
                        setErrors(prev => ({ ...prev, nationality: '' }));
                      }
                    }}
                    error={errors.nationality}
                  />
                </div>
              </div>

              {/* ID Type & Number */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/90 flex items-center gap-2">
                    <IdCard className="w-4 h-4" />
                    {t('guestInfo.idType')} {t('guestInfo.required')}
                  </label>
                  <select
                    name="idType"
                    value={formData.idType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/5 border ${
                      errors.idType ? 'border-red-400' : 'border-white/20'
                    } rounded-xl text-white focus:outline-none focus:border-amber-400 focus:bg-white/10 transition-all duration-300`}
                  >
                    <option value="" className="bg-gray-900">{t('guestInfo.idTypePlaceholder')}</option>
                    <option value="iqama" className="bg-gray-900">{t('guestInfo.idTypeIqama')}</option>
                    <option value="passport" className="bg-gray-900">{t('guestInfo.idTypePassport')}</option>
                    <option value="national_id" className="bg-gray-900">{t('guestInfo.idTypeNationalId')}</option>
                  </select>
                  {errors.idType && (
                    <p className="text-red-400 text-xs mt-1">{errors.idType}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/90">
                    {t('guestInfo.idNumber')} {t('guestInfo.required')}
                  </label>
                  <input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/5 border ${
                      errors.idNumber ? 'border-red-400' : 'border-white/20'
                    } rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-amber-400 focus:bg-white/10 transition-all duration-300`}
                    placeholder={t('guestInfo.idNumberPlaceholder')}
                  />
                  {errors.idNumber && (
                    <p className="text-red-400 text-xs mt-1">{errors.idNumber}</p>
                  )}
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white/90">
                  {t('guestInfo.specialRequests')}
                </label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-amber-400 focus:bg-white/10 transition-all duration-300 resize-none"
                  placeholder={t('guestInfo.specialRequestsPlaceholder')}
                />
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
            <button
              onClick={handleContinue}
              className="w-full bg-[#F3EFE9] text-gray-900 font-bold py-4 px-6 rounded-full hover:bg-[#E8E4DD] transition-all duration-300 hover:scale-[1.02] shadow-xl"
            >
              {t('guestInfo.continue')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
