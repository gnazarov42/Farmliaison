import { useI18n } from 'vue-i18n';

interface TranslatedObject {
  [key: string]: string;
}

export const useTranslated = (valueString: string) => {
  const { locale } = useI18n();
  const currentLocale: string = locale.value;

  // Parse the JSON string into a JavaScript object
  const valueObject: TranslatedObject = JSON.parse(valueString);

  // Check if the current locale is available in the value object, otherwise, use 'en' as a fallback.
  const localizedValue = valueObject[currentLocale] || valueObject.en;

  return localizedValue;
};
