import {
  updateJsonFieldsWithTranslation,
  prepareLocalizedJsonUpdate,
} from './utils';
import { prisma } from '.';

export const createActivity = async (ActivityData, locale) => {
  try {
    // Prepare the name with translations for all locales
    const nameWithTranslations = await prepareLocalizedJsonUpdate(
      locale,
      { name: ActivityData.name },
      {}, // Pass an empty object since this is a new activity
    );

    // Create the activity with the localized names
    const createdActivity = await prisma.Activity.create({
      data: {
        name: nameWithTranslations.name,
      },
    });

    console.log(
      '🚀 ~ file: activity.js:13 ~ createActivity ~ createdActivity:',
      createdActivity,
    );

    return createdActivity;
  } catch (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
};

export const getActivities = (locale) => {
  return prisma.$queryRawUnsafe(
    `select id, name->>'${locale}' as name from "Activity"`,
  );
};

export const getActivityById = (activityId, locale) => {
  console.log('🚀 ~ file: activity.js:16 ~ getActivityById ~ locale:', locale);
  return prisma.Activity.findUnique({
    where: {
      activityId,
    },
  });
};

export const updateActivity = (activityId, updatedData, locale) => {
  try {
    return (updatedFieldValue = updateJsonFieldsWithTranslation(
      'Activity',
      ['name'],
      activityId,
      locale,
      updatedData,
    ));
  } catch (error) {
    console.error('Error updating activity:', error);
    throw error;
  }
};

// Additional methods can be added here for specific use cases
