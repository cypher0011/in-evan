import { useEffect, useState } from 'react';
import enMessages from '@/messages/en.json';
import arMessages from '@/messages/ar.json';
import krMessages from '@/messages/kr.json';

type Messages = typeof enMessages;
type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${NestedKeyOf<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

type TranslationKey = NestedKeyOf<Messages>;

const messages: Record<string, Messages> = {
  en: enMessages,
  ar: arMessages,
  kr: krMessages,
};

export function useTranslations() {
  const [locale, setLocale] = useState<string>('en');

  useEffect(() => {
    // Get saved language from localStorage
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && messages[savedLanguage]) {
      setLocale(savedLanguage);
      document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLanguage;
    }
  }, []);

  const changeLanguage = (newLocale: string) => {
    if (messages[newLocale]) {
      setLocale(newLocale);
      localStorage.setItem('preferredLanguage', newLocale);
      document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = newLocale;
    }
  };

  const t = (key: TranslationKey): string => {
    const keys = key.split('.');
    let value: any = messages[locale];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return { t, locale, changeLanguage, isRTL: locale === 'ar' };
}
