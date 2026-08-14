import { en } from './locales/en';
import { kn } from './locales/kn';
import { hi } from './locales/hi';
import { te } from './locales/te';
import { ta } from './locales/ta';
import { ml } from './locales/ml';
import { legalKn } from './locales/legal-kn';
import { legalHi } from './locales/legal-hi';
import { legalTe } from './locales/legal-te';
import { legalTa } from './locales/legal-ta';
import { legalMl } from './locales/legal-ml';

export type Language = 'en' | 'kn' | 'hi' | 'te' | 'ta' | 'ml';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
];

export const translations: Record<Language, Record<string, string>> = {
  en,
  kn: { ...kn, ...legalKn },
  hi: { ...hi, ...legalHi },
  te: { ...te, ...legalTe },
  ta: { ...ta, ...legalTa },
  ml: { ...ml, ...legalMl },
};
