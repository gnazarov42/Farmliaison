import { localizeField, prepareLocalizedJsonUpdate } from './utils';
import { updateMediaFileOrder } from './mediaFiles';
import { updateUserCredits, CREDIT_AMOUNTS } from './users';
import { prisma } from '.';

export const getFarms = async (locale = 'en') => {
  try {
    const farms = await prisma.farmProfile.findMany({
      orderBy: {
        updatedAt: 'desc', // Corrected to 'updatedAt' for descending order as per your comment
      },
      include: {
        favorites: true,
        mediaFiles: {
          orderBy: {
            order: 'asc', // Ordering media files by 'order' field
          },
        },
      },
    });

    // Localize description field for each farm
    const locFarms = farms.map((farm) => ({
      ...farm,
      description: localizeField(farm.description, locale),
    }));

    return locFarms;
  } catch (error) {
    console.error('Error fetching farms:', error);
    throw new Error('Failed to fetch farms');
  }
};

export const getFarmsNearby = async (
  locale = 'en',
  userLat = 43.5343,
  userLon = -5.6615,
  maxDistanceInMeters = 0,
  userId = null, // Add userId parameter
) => {
  try {
    if (!maxDistanceInMeters) maxDistanceInMeters = 40000000; // Default to a large distance if not provided

    let farmsQuery = `
      SELECT
        fp.id,
        fp.name,
        fp.address,
        fp.latitude,
        fp.longitude,
        fp."farmSlug",
        fp."metaDescription",
        COALESCE(json_agg(mf ORDER BY mf."order") FILTER (WHERE mf.id IS NOT NULL), '[]') as "mediaFiles",
        COALESCE(json_agg(fv) FILTER (WHERE fv.id IS NOT NULL), '[]') as "favorites",
        ST_Distance(
          ST_SetSRID(ST_MakePoint(fp.longitude, fp.latitude), 4326)::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
        ) AS distance
      FROM
        "FarmProfile" fp
      LEFT JOIN
        "_FarmProfileToMediaFile" pf ON pf."A" = fp.id
      LEFT JOIN
        "MediaFile" mf ON mf.id = pf."B"
      LEFT JOIN
        "Favorite" fv ON fv."farmId" = fp.id
      WHERE
        ST_DWithin(
          ST_SetSRID(ST_MakePoint(fp.longitude, fp.latitude), 4326)::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
          $3::bigint
        )
    `;

    const queryParams = [userLon, userLat, maxDistanceInMeters];

    if (userId) {
      farmsQuery += ` AND fv."userId" = $4`;
      queryParams.push(userId);
    }

    farmsQuery += `
      GROUP BY
        fp.id
      ORDER BY
        distance
      LIMIT
        100;
    `;

    const farms = await prisma.$queryRawUnsafe(farmsQuery, ...queryParams);

    // Localize metaDescription field for each farm
    const localizedFarms = farms.map((farm) => ({
      ...farm,
      userLat,
      userLon,
      metaDescription: localizeField(farm.metaDescription, locale),
      mediaFiles: farm.mediaFiles.map((mediaFile) => {
        const { id, url, order, description } = mediaFile;
        return { id, url, order, description };
      }), // No need to sort in JS, should be ordered by SQL
    }));

    return localizedFarms;
  } catch (error) {
    console.error('Error fetching nearby farms:', error);
    throw new Error('Failed to fetch nearby farms');
  }
};

export const createFarmProfile = async (data, locale = 'en') => {
  // Prepare the description with translations
  const translatedData = await prepareLocalizedJsonUpdate(
    locale,
    { description: data.description },
    { metaDescription: data.metaDescription },
    {}, // Pass an empty object to indicate that all translations should be created
  );
  const userId = data.userId; // Assuming 'userId' is passed in 'data'
  delete data.userId; // Remove 'userId' from 'data' to avoid creating a new user

  const newFarm = await prisma.farmProfile.create({
    data: {
      ...data,
      description: translatedData.description,
      metaDescription: translatedData.metaDescription,
      user: {
        connect: {
          id: userId,
        },
      },
    },
    include: {
      user: true,
    },
  });

  // Update the user's credits
  await updateUserCredits(userId, CREDIT_AMOUNTS.INITIAL_FARM_CREATION);

  return newFarm;
};

export const updateFarmProfile = async (farmSlug, data, locale = 'en') => {
  // Default locale to 'en'
  const farm = await getFarmProfileBySlug(farmSlug);

  // Delete existing farm activities if the farm exists and before updating the farm profile
  if (farm) {
    await prisma.farmActivity.deleteMany({
      where: {
        farmId: farm.id,
      },
    });
  }

  try {
    await updateMediaFileOrder(data.mediaFiles);
  } catch (error) {
    console.error('Error updating media file order:', error);
  }

  // Prepare the description with updated source locale and translations for missing locales
  let translatedData = {
    description: farm.description,
    metaDescription: farm.metaDescription,
  };
  if (
    (translatedData?.description &&
      data.description !== translatedData?.description[locale]) ||
    !data.translateAll
  ) {
    // update only current locale and translate missing locales
    translatedData = await prepareLocalizedJsonUpdate(
      locale,
      { description: data.description, metaDescription: data.metaDescription },
      { description: farm.description, metaDescription: farm.metaDescription },
    );
  } else {
    // update current locale and translate all locales
    translatedData = await prepareLocalizedJsonUpdate(locale, {
      description: data.description,
      metaDescription: data.metaDescription,
    });
  }

  const result = await prisma.farmProfile.upsert({
    where: {
      farmSlug,
    },
    create: {
      name: data.name,
      location: data.location,
      latitude: data.latitude,
      longitude: data.longitude,
      pictures: data.pictures,
      web: data.web,
      address: data.address,
      email: data.email,
      phone: data.phone,
      description: translatedData.description,
      metaDescription: translatedData.metaDescription,
      farmSlug: data.farmSlug,
      user: {
        // Use 'user' and 'connect' for the relation
        connect: {
          id: data.userId,
        },
      },
      activities: {
        create: data.activities.map((activity) => ({
          activity: {
            connect: {
              id: activity.value, // Assuming activity.value is the ID of the Activity
            },
          },
        })),
      },
    },
    update: {
      name: data.name,
      location: data.location,
      latitude: data.latitude,
      longitude: data.longitude,
      pictures: data.pictures,
      web: data.web,
      address: data.address,
      email: data.email,
      phone: data.phone,
      description: translatedData.description,
      metaDescription: translatedData.metaDescription,
      farmSlug: data.farmSlug,
      user: {
        // Use 'user' and 'connect' for the relation
        connect: {
          id: data.userId,
        },
      },
      // Include related data updates as needed for updating
      // Use 'connect' and 'disconnect' to update relationships

      // Example for activities: connect new activities, disconnect removed activities
      activities: {
        create: data.activities.map((activity) => ({
          activity: {
            connect: {
              id: activity.value, // Assuming activity.value is the ID of the Activity
            },
          },
        })),
      },

      // If you also want to update the names of existing activities:
      // updateMany: data.activities.map((activity) => ({
      //   where: { id: activity.id }, // Assuming each activity has an 'id'
      //   data: { name: activity.name }, // Update the 'name' property
      // })),

      // Repeat the same pattern for other related tables (createdEvents, favorites, jobs, products)
    },
    include: {
      bookings: true,
      createdEvents: true,
      activities: true,
      favorites: true,
      jobs: true,
      products: true,
      mediaFiles: {
        orderBy: {
          order: 'asc', // Ordering media files by 'order' field
        },
      },
      user: {
        // Exclude the 'password' field
        select: {
          id: true,
          email: true,
          phone: true,
          image: true,
          name: true,
          profileImage: true,
          // Include other fields you need from the 'user' model
          // Exclude 'password' field explicitly
        },
      },
    },
  });
  return result;
};

export const getFarmProfileBySlug = async (farmSlug, locale) => {
  const farmProfile = await prisma.farmProfile.findUnique({
    where: {
      farmSlug,
    },
    include: {
      bookings: true,
      createdEvents: true,
      activities: {
        select: {
          activity: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      favorites: true,
      jobs: true,
      products: {
        include: {
          mediaFiles: {
            orderBy: {
              order: 'asc', // Ordering media files by 'order' field
            },
          },
        },
      },
      mediaFiles: {
        orderBy: {
          order: 'asc', // Ordering media files by 'order' field
        },
      },
      user: {
        // Exclude the 'password' field
        select: {
          id: true,
          email: true,
          phone: true,
          image: true,
          name: true,
          profileImage: true,
          // Include other fields you need from the 'user' model
          // Exclude 'password' field explicitly
        },
      },
    },
  });

  // Transform the activities to include only the name for the current locale
  if (farmProfile && locale) {
    // Localize the farm profile description
    if (farmProfile.description) {
      farmProfile.description = localizeField(farmProfile.description, locale);
    }
    if (farmProfile.metaDescription) {
      farmProfile.metaDescription = localizeField(
        farmProfile.metaDescription,
        locale,
      );
    }

    // Localize activity names
    if (farmProfile.activities) {
      farmProfile.activities.forEach((farmActivity) => {
        if (farmActivity.activity && farmActivity.activity.name) {
          farmActivity.name = localizeField(farmActivity.activity.name, locale);
          farmActivity.id = farmActivity.activity.id;
          delete farmActivity.activity; // Remove the nested activity object
        }
      });
    }
    // Localize products
    if (farmProfile.products) {
      farmProfile.products.forEach((product) => {
        if (product && product.name) {
          product.name = localizeField(product.name, locale);
        }
        if (product && product.description) {
          product.description = localizeField(product.description, locale);
        }
        if (product.mediaFiles) {
          product.mediaFiles = product.mediaFiles.map((mediaFile) => {
            const { id, url, order, description } = mediaFile;
            return { id, url, order, description };
          });
        }
      });
    }

    // Localize jobs
    if (farmProfile.jobs) {
      farmProfile.jobs.forEach((job) => {
        if (job && job.title) {
          job.title = localizeField(job.title, locale);
        }
        if (job && job.description) {
          job.description = localizeField(job.description, locale);
        }
      });
    }

    // Example: Localize event names and descriptions
    if (farmProfile.createdEvents) {
      farmProfile.createdEvents.forEach((event) => {
        if (event.name) {
          event.name = localizeField(event.name, locale);
        }
        if (event.description) {
          event.description = localizeField(event.description, locale);
        }
      });
    }

    if (farmProfile.mediaFiles) {
      farmProfile.mediaFiles = farmProfile.mediaFiles.map((mediaFile) => {
        const { id, url, order, description } = mediaFile;
        return { id, url, order, description };
      });
    }
  }

  return farmProfile;
};

export const getFarmOwnerBySlug = async (farmSlug) => {
  const farm = await prisma.farmProfile.findUnique({
    where: {
      farmSlug,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  if (farm) {
    return farm.user;
  } else {
    return null; // Handle the case where the farm does not exist
  }
};

export const getFarmSlugByOwner = async (userId) => {
  const farm = await prisma.farmProfile.findUnique({
    where: {
      userId,
    },
  });
  if (farm) {
    return { farmSlug: farm.farmSlug, farmName: farm.name };
  }
  return null;
};

// Additional methods can be added here for specific use cases
