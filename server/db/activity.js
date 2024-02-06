import { updateJsonFieldWithTranslation } from './utils'; // Replace with the actual path
import { prisma } from '.';

export const createActivity = async (ActivityData, locale) => {
  try {
    const createdActivity = await prisma.Activity.create({
      data: {
        name: {
          [locale]: ActivityData.name, // Initial value for the default locale
        },
      },
    });
    console.log(
      '🚀 ~ file: activity.js:13 ~ createActivity ~ createdActivity:',
      createdActivity,
    );

    // Update the name field with translations for each locale
    updateJsonFieldWithTranslation(
      'Activity',
      'name',
      createdActivity.id,
      locale,
      ActivityData.name,
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
    return (updatedFieldValue = updateJsonFieldWithTranslation(
      'Activity',
      'name',
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
