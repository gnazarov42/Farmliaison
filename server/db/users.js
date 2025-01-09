import { prisma } from '.';
import { getFarmSlugByOwner } from './farm';
import { localizeField, prepareLocalizedJsonUpdate } from './utils';

export const CREDIT_AMOUNTS = {
  INITIAL_FARM_CREATION: 50,
  EVENT_CREATION: -10,
  EVENT_EDIT: -2,
  JOB_POST: -5,
  EVENT_PARTICIPATION_ORGANIZER: 2,
  EVENT_PARTICIPATION_USER: 3,
  REVIEW_RECEIVED: 2,
  SUBSCRIPTION_RENEWAL: 30, // 20 credits for subscription + 10 bonus credits
};

export const createUser = (userData) => {
  const finalUserData = {
    ...userData,
  };

  return prisma.user.create({
    data: finalUserData,
  });
};

export const getUserByUsername = (username) => {
  return prisma.user.findUnique({
    where: {
      username,
    },
  });
};

export const getUserByEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    throw new Error('User not found');
  }
  if (user.type.includes('farmer')) {
    const { farmSlug, farmName } = await getFarmSlugByOwner(user.id);
    user.farmSlug = farmSlug;
    user.farmName = farmName;
  }
  return user;
};

export const getUserById = async (userId, locale = 'en') => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      userLanguage: {
        include: {
          language: true, // Include full language details
        },
      },
      specialties: {
        include: {
          specialty: true, // Include full specialty details
        },
      },
      farm: true, // Optionally include the user's farm details, if needed
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Transform and localize the user data
  const transformedUser = {
    ...user,
    languages: user.userLanguage.map((ul) => ({
      label: ul.language.name, // Assuming `name` is the language name field
      value: ul.language.id,
    })),
    specialties: user.specialties.map((us) => ({
      label: localizeField(us.specialty.name, locale), // Assuming `name` is JSON with localized names
      value: us.specialty.id,
    })),
  };

  // Localize optional fields like description
  if (user.description) {
    transformedUser.description = localizeField(user.description, locale);
  }
  if (user.workerExperience) {
    transformedUser.workerExperience = localizeField(
      user.workerExperience,
      locale,
    );
  }

  // If the user is a farmer, fetch the farmSlug
  if (user.type.includes('farmer')) {
    const { farmSlug, farmName } = await getFarmSlugByOwner(user.id);
    transformedUser.farmSlug = farmSlug;
    transformedUser.farmName = farmName;
  }

  // Cleanup unnecessary fields
  // delete transformedUser.userLanguage; // Remove raw userLanguage relation
  // delete transformedUser.specialties; // Remove raw specialties relation

  return transformedUser;
};

export const updateUser = async (userId, updatedData, locale = 'en') => {
  // Check if the user exists
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw new Error('User not found');
  }

  const {
    languages,
    specialties,
    description,
    workerExperience,
    ...restOfData
  } = updatedData;

  // Handle userLanguage relations
  if (languages) {
    // Clear existing languages for the user
    await prisma.userLanguage.deleteMany({
      where: { userId },
    });

    // Add new languages
    await prisma.userLanguage.createMany({
      data: languages.map((language) => ({
        userId,
        languageId: language.value, // Use 'value' as the ID
      })),
    });
  }

  // Handle specialties relations
  if (specialties) {
    // Clear existing specialties for the user
    await prisma.userSpecialty.deleteMany({
      where: { userId },
    });

    // Add new specialties
    await prisma.userSpecialty.createMany({
      data: specialties.map((specialty) => ({
        userId,
        specialtyId: specialty.value, // Use 'value' as the ID
      })),
    });
  }

  // Prepare translations for text fields
  const translatedData = await prepareLocalizedJsonUpdate(
    locale,
    { description, workerExperience },
    {
      description: existingUser.description,
      workerExperience: existingUser.workerExperience,
    },
  );

  // Update the user record with other fields and save the locale
  return prisma.user.update({
    where: { id: userId },
    data: {
      ...restOfData, // Update scalar fields
      ...translatedData, // Update localized fields
      locale, // Save the user's main language
    },
    include: {
      userLanguage: {
        include: {
          language: true,
        },
      },
      specialties: {
        include: {
          specialty: true,
        },
      },
    },
  });
};

export const updateUserCredits = async (userId, amount) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const newCredits = user.credits + amount;

  if (newCredits < 0) {
    throw new Error('Not enough credits');
  }

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      credits: newCredits,
    },
  });
};
