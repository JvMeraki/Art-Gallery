import { defaultLang, ui } from './ui';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(
    key: keyof typeof ui[typeof defaultLang],
    params?: Record<string, string | number>
  ) {
    let translation: string = ui[lang][key] || ui[defaultLang][key];
    if (!translation) return "";

    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue));
      });
    }
    return translation;
  }
}