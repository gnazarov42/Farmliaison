import { translateText } from '~/server/utils/ai';
import { prisma } from '.';

export const localizeField = (fieldContent, locale, defaultValue = '') => {
  if (fieldContent && typeof fieldContent === 'object') {
    return fieldContent[locale] || defaultValue;
  }
  return defaultValue;
};

export const prepareLocalizedJsonUpdate = async (
  sourceLocale,
  updatedValue,
  existingJson = {}, // Default to an empty object if existingJson is not provided
) => {
  // Define the target locales within the function
  const targetLocales = ['en', 'es', 'de', 'fr', 'it', 'tr', 'ru'];

  // Initialize the updated JSON object
  const updatedJson = { ...existingJson };

  // Loop through each property in the updatedValue
  for (const key in updatedValue) {
    if (Object.hasOwnProperty.call(updatedValue, key)) {
      // Ensure the property exists in updatedJson
      if (!updatedJson[key]) {
        updatedJson[key] = {};
      }

      // Always update the current locale for the property
      updatedJson[key][sourceLocale] = updatedValue[key];

      // Determine which locales need translations
      let localesToTranslate;
      if (!existingJson[key]) {
        // If the property is missing in existingJson, translate for all locales except the source locale
        localesToTranslate = targetLocales.filter(
          (locale) => locale !== sourceLocale,
        );
      } else {
        // If the property exists in existingJson, translate only for missing or empty locales
        localesToTranslate = targetLocales.filter(
          (locale) =>
            locale !== sourceLocale &&
            (!existingJson[key][locale] ||
              existingJson[key][locale].trim() === ''),
        );
      }

      // Initialize translation promises for locales that need translation
      const translationPromises = localesToTranslate.map((targetLocale) => {
        return translateText(updatedValue[key], targetLocale);
      });

      // Await all translation promises
      const translations = await Promise.all(translationPromises);

      // Apply translations to the updatedJson for the property
      localesToTranslate.forEach((locale, index) => {
        updatedJson[key][locale] = translations[index];
      });
    }
  }
  // Return the updated JSON for further usage
  return updatedJson;
};

export const updateJsonFieldsWithTranslation = async (
  tableName,
  fieldNames,
  recordId,
  sourceLocale,
  updatedValues,
  updateOnlyCurrentLocale = false, // New optional parameter
) => {
  try {
    // Fetch the existing record data from the database
    const existingRecord = await prisma[tableName].findUnique({
      where: {
        id: recordId,
      },
    });

    if (!existingRecord) {
      throw new Error(`${tableName} record with ID ${recordId} not found.`);
    }

    // Filter updatedValues and existingJson to include only the fields in fieldNames
    const filteredUpdatedValues = {};
    const filteredExistingJson = {};

    for (const fieldName of fieldNames) {
      if (updatedValues[fieldName] !== undefined) {
        filteredUpdatedValues[fieldName] = updatedValues[fieldName];
      }

      if (existingRecord[fieldName] !== undefined) {
        filteredExistingJson[fieldName] = existingRecord[fieldName];
      }
    }

    // Use prepareLocalizedJsonUpdate to handle the localization and translation
    let updatedJson = {};

    if (updateOnlyCurrentLocale) {
      updatedJson = await prepareLocalizedJsonUpdate(
        sourceLocale,
        filteredUpdatedValues,
        filteredExistingJson,
      );
    } else {
      // Revert other locales to existing values and update the current locale
      // const otherLocalesJson = {};

      // for (const fieldName of fieldNames) {
      //   otherLocalesJson[fieldName] = {};

      //   for (const locale in existingRecord[fieldName]) {
      //     if (locale !== sourceLocale) {
      //       otherLocalesJson[fieldName][locale] =
      //         existingRecord[fieldName][locale];
      //     }
      //   }
      // }

      updatedJson = await prepareLocalizedJsonUpdate(
        sourceLocale,
        filteredUpdatedValues,
      );
    }

    // Perform the update with the updated JSON
    const updatedRecord = await prisma[tableName].update({
      where: {
        id: recordId,
      },
      data: updatedJson,
    });

    // Return the updated values
    return updatedRecord;
  } catch (error) {
    throw new Error(`Error updating fields in ${tableName}: ${error.message}`);
  }
};
