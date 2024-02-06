import { useI18n } from 'vue-i18n';

export const useLocale = () => {
  const { locale } = useI18n();
  return locale.value;
};
