import { prisma } from '.';

export const getFarms = () => {
  return prisma.farmProfile.findMany({
    include: {
      favorites: true,
    },
  });
};

export const updateFarmProfile = async (farmSlug, data) => {
  const farm = await getFarmProfileBySlug(farmSlug);

  if (farm) {
    await prisma.farmActivity.deleteMany({
      where: {
        farmId: farm.id,
      },
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
      email: data.email,
      phone: data.phone,
      description: data.description,
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
      email: data.email,
      phone: data.phone,
      description: data.description,
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
      mediaFiles: true,
      user: {
        // Exclude the 'password' field
        select: {
          id: true,
          email: true,
          phone: true,
          image: true,
          // Include other fields you need from the 'user' model
          // Exclude 'password' field explicitly
        },
      },
    },
  });
  return result;
};

export const getFarmProfileBySlug = (farmSlug) => {
  return prisma.farmProfile.findUnique({
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
      products: true,
      mediaFiles: true,
      user: {
        // Exclude the 'password' field
        select: {
          id: true,
          email: true,
          phone: true,
          image: true,
          // Include other fields you need from the 'user' model
          // Exclude 'password' field explicitly
        },
      },
    },
  });
};

export const getFarmOwnerBySlug = async (farmSlug) => {
  const farm = await prisma.farmProfile.findUnique({
    where: {
      farmSlug,
    },
    include: {
      user: true, // Assuming the user relationship exists in your data model
    },
  });

  if (farm) {
    return farm.user;
  } else {
    return null; // Handle the case where the farm does not exist
  }
};

// Additional methods can be added here for specific use cases
