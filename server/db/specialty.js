import {
  updateJsonFieldsWithTranslation,
  prepareLocalizedJsonUpdate,
} from './utils';
import { prisma } from '.';

export const createSpecialty = async (SpecialtyData, locale) => {
  try {
    // Prepare the name with translations for all locales
    const nameWithTranslations = await prepareLocalizedJsonUpdate(
      locale,
      { name: SpecialtyData.name },
      {}, // Pass an empty object since this is a new specialty
    );

    // Create the specialty with the localized names
    const createdSpecialty = await prisma.Specialty.create({
      data: {
        name: nameWithTranslations.name,
      },
    });

    console.log(
      '🚀 ~ file: specialty.js:13 ~ createSpecialty ~ createdSpecialty:',
      createdSpecialty,
    );

    const localizedSpecialty = {
      id: createdSpecialty.id,
      name: nameWithTranslations.name[locale],
    };

    return localizedSpecialty;
  } catch (error) {
    console.error('Error creating specialty:', error);
    throw error;
  }
};

export const getSpecialties = (locale) => {
  return prisma.$queryRawUnsafe(
    `select id, name->>'${locale}' as name from "Specialty"`,
  );
};

export const getSpecialtyById = (specialtyId, locale) => {
  console.log(
    '🚀 ~ file: specialty.js:16 ~ getSpecialtyById ~ locale:',
    locale,
  );
  return prisma.Specialty.findUnique({
    where: {
      specialtyId,
    },
  });
};

export const updateSpecialty = (specialtyId, updatedData, locale) => {
  try {
    return (updatedFieldValue = updateJsonFieldsWithTranslation(
      'Specialty',
      ['name'],
      specialtyId,
      locale,
      updatedData,
    ));
  } catch (error) {
    console.error('Error updating specialty:', error);
    throw error;
  }
};

// Additional methods can be added here for specific use cases
