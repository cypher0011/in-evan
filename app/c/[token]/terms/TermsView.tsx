'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ConsentItem from './ConsentItem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { useTranslations } from '@/lib/i18n/useTranslations';
import LanguageSwitcher from '@/components/LanguageSwitcher';

// Lazy-load SignatureCanvas - it's heavy and only used on this page
const SignatureCanvas = dynamic(() => import('react-signature-canvas'), {
  ssr: false,
  loading: () => <div className="w-full h-32 rounded-lg bg-slate-700/50 animate-pulse" />,
}) as any;

type TermsViewProps = {
  token: string;
  hotelName: string;
  termsText?: string;
};

export default function TermsView({ token, hotelName, termsText }: TermsViewProps) {
  const router = useRouter();
  const sigCanvas = useRef<any>(null);
  const { t, locale, changeLanguage, isRTL } = useTranslations();

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [dataConsent, setDataConsent] = useState(false);
  const [photoConsent, setPhotoConsent] = useState(false);
  const [isSigned, setIsSigned] = useState(false);

  const isContinueDisabled = !termsAccepted || !dataConsent || !photoConsent || !isSigned;

  const handleClearSignature = () => {
    sigCanvas.current?.clear();
    setIsSigned(false);
  };

  const handleSignatureEnd = () => {
    if (!sigCanvas.current?.isEmpty()) setIsSigned(true);
  };

  const handleContinue = () => {
    if (!isContinueDisabled) {
      router.push(`/c/${token}/booking-details`);
    }
  };

  const defaultTermsText = termsText || `Welcome to ${hotelName}. By proceeding with your check-in, you agree to abide by our hotel policies and terms of service. These include but are not limited to: maintaining a respectful environment for all guests, adhering to check-in and check-out times, and being responsible for any damage to hotel property. Your privacy and security are important to us, and we are committed to protecting your personal information in accordance with applicable data protection laws.`;

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Language Switcher - Always on the right */}
      <div className="fixed top-6 right-6 z-20">
        <LanguageSwitcher currentLanguage={locale} onLanguageChange={(language) => changeLanguage(language.code)} />
      </div>

      {/* Content */}
      <main className="relative z-10 flex items-center justify-center min-h-screen p-4 py-12 animate-in fade-in duration-500">
        <div className="w-full max-w-md">
          {/* Terms of Service Card */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="w-full bg-slate-900/50 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-2xl mb-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl font-bold m-0">{t('terms.title')}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-40 overflow-y-auto custom-scrollbar">
                <CardDescription className="text-slate-300 text-sm leading-relaxed">
                  {defaultTermsText}
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Consents Card */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <Card className="w-full bg-slate-900/50 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-white shadow-2xl">
              <CardHeader className="text-center p-0 mb-6">
                <CardTitle className="text-3xl font-bold m-0">{t('terms.consentsTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-3 mb-6">
                  <ConsentItem
                    checked={termsAccepted}
                    onChange={setTermsAccepted}
                    text={t('terms.termsAccept')}
                  />
                  <ConsentItem
                    checked={dataConsent}
                    onChange={setDataConsent}
                    text={t('terms.dataConsent')}
                  />
                  <ConsentItem
                    checked={photoConsent}
                    onChange={setPhotoConsent}
                    text={t('terms.photoConsent')}
                  />
                </div>

                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-slate-100">{t('terms.yourSignature')}</h3>
                    <Button
                      variant="link"
                      onClick={handleClearSignature}
                      className="text-slate-400 hover:text-white text-sm font-semibold p-0 h-auto"
                    >
                      {t('terms.clear')}
                    </Button>
                  </div>
                  <div className="bg-slate-200 rounded-lg shadow-inner">
                    <SignatureCanvas
                      ref={sigCanvas}
                      penColor="black"
                      canvasProps={{ className: 'w-full h-32 rounded-lg' }}
                      onEnd={handleSignatureEnd}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Continue Button */}
          <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Button
              onClick={handleContinue}
              disabled={isContinueDisabled}
              className="w-full bg-[#F3EFE9] text-black font-bold h-16 rounded-full text-lg shadow-lg hover:bg-[#E8E4DD] transform hover:scale-[1.02] transition-all duration-300 ease-in-out disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed disabled:transform-none"
            >
              {t('terms.continue')}
            </Button>
          </div>

        </div>
      </main>
    </div>
  );
}
