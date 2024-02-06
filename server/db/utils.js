import translate from 'translate-google';
import { prisma } from '.';

export const updateJsonFieldWithTranslation = async (
  tableName,
  fieldName,
  recordId,
  sourceLocale,
  updatedValue,
) => {
  const targetLocales = ['en', 'es', 'de', 'fr', 'it', 'tr', 'ru']; // Array of target locales

  console.log('🚀 ~ file: utils.js:11 ~ tableName:', tableName);
  console.log('🚀 ~ file: utils.js:18 ~ recordId:', recordId);
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

    // Update the JSON field for the specified source locale
    const updatedData = { ...existingRecord[fieldName] };
    console.log('🚀 ~ file: utils.js:27 ~ updatedData:', updatedData);
    updatedData[sourceLocale] = updatedValue;

    // Perform translation for all target locales at once
    const translationPromises = targetLocales.map((targetLocale) => {
      if (targetLocale !== sourceLocale) {
        return translate(updatedValue, {
          from: sourceLocale,
          to: targetLocale,
        });
      } else {
        // No need to translate for the source locale
        return updatedValue;
      }
    });

    const translatedValues = await Promise.all(translationPromises);
    console.log('🚀 ~ file: utils.js:44 ~ translatedValues:', translatedValues);

    // Map the translated values to their respective target locales
    targetLocales.forEach((targetLocale, index) => {
      if (targetLocale !== sourceLocale) {
        updatedData[targetLocale] = translatedValues[index];
      }
    });

    // Perform the update
    const updatedRecord = await prisma[tableName].update({
      where: {
        id: recordId,
      },
      data: {
        [fieldName]: updatedData,
      },
    });

    // Return the updated value
    return updatedRecord[fieldName];
  } catch (error) {
    throw new Error(
      `Error updating ${fieldName} in ${tableName}: ${error.message}`,
    );
  }
};
