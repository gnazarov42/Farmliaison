import { prisma } from '.';
import { localizeField, prepareLocalizedJsonUpdate } from './utils';
import { updateUserCredits, CREDIT_AMOUNTS } from './users'; // Adjust the path based on your actual file structure

// Create Event
export const createEvent = async (data, locale = 'en') => {
  const translatedData = await prepareLocalizedJsonUpdate(locale, {
    description: data.description,
    title: data.title,
    metaDescription: data.metaDescription,
  });

  // Find FarmProfile by farmSlug
  const farmProfile = await prisma.farmProfile.findUnique({
    where: { farmSlug: data.farmSlug },
  });

  if (!farmProfile) {
    throw new Error('FarmProfile not found');
  }

  // Deduct credits from the user
  await updateUserCredits(farmProfile.userId, CREDIT_AMOUNTS.EVENT_CREATION);

  const newEvent = await prisma.event.create({
    data: {
      date: data.date,
      location: data.location,
      latitude: data.latitude,
      longitude: data.longitude,
      creatorFarm: {
        connect: {
          id: farmProfile.id, // Use the id from the found FarmProfile
        },
      },
      description: translatedData.description,
      address: data.address,
      email: data.email,
      phone: data.phone,
      isPublic: data.isPublic,
      title: translatedData.title,
      metaDescription: translatedData.metaDescription,
      publicationStatus: data.publicationStatus,
    },
  });

  return newEvent;
};

// Update Event
export const updateEvent = async (eventId, data, locale = 'en') => {
  const event = await prisma.event.findUnique({ where: { id: eventId } });

  if (!event) {
    throw new Error('Event not found');
  }

  const translatedData = await prepareLocalizedJsonUpdate(
    locale,
    {
      description: data.description,
      title: data.title,
      metaDescription: data.metaDescription,
    },
    {
      description: event.description,
      title: event.title,
      metaDescription: event.metaDescription,
    },
  );

  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: {
      date: data.date,
      location: data.location,
      latitude: data.latitude,
      longitude: data.longitude,
      description: translatedData.description,
      address: data.address,
      email: data.email,
      phone: data.phone,
      isPublic: data.isPublic,
      title: translatedData.title,
      metaDescription: translatedData.metaDescription,
      publicationStatus: data.publicationStatus,
    },
  });

  return updatedEvent;
};

// Join Event
export const joinEvent = async (
  eventId,
  farmId,
  description = null,
  locale = 'en',
) => {
  // Check if the event and farm exist
  const existingEvent = await prisma.event.findUnique({
    where: { id: eventId },
    include: { creatorFarm: true },
  });
  const existingFarm = await prisma.farmProfile.findUnique({
    where: { id: farmId },
    include: { user: true },
  });

  if (!existingEvent || !existingFarm) {
    throw new Error('Event or Farm not found');
  }

  // Check if the event is public
  if (!existingEvent.isPublic) {
    throw new Error('This event is not open to new farms');
  }

  // Create the FarmerEvent record
  await prisma.farmerEvent.create({
    data: {
      eventId,
      farmId,
    },
  });

  // Award credits to the event organizer
  await updateUserCredits(
    existingEvent.creatorFarm.userId,
    CREDIT_AMOUNTS.EVENT_PARTICIPATION_ORGANIZER,
  );

  // Award credits to the participant
  await updateUserCredits(
    existingFarm.user.id,
    CREDIT_AMOUNTS.EVENT_PARTICIPATION_USER,
  );

  // Optionally, update the description if provided and save to history
  if (description) {
    await prisma.event.update({
      where: { id: eventId },
      data: { description },
    });

    await prisma.eventHistory.create({
      data: {
        eventId,
        farmId,
        description,
      },
    });
  }

  return { message: 'Joined event successfully' };
};

// Get Event Details
export const getEventDetails = async (eventId, locale = 'en') => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      mediaFiles: {
        orderBy: {
          order: 'asc', // Ordering media files by 'order' field
        },
      },
      eventHistories: {
        include: {
          farm: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!event) {
    throw new Error('Event not found');
  }

  // Localize fields
  event.description = localizeField(event.description, locale);
  event.metaDescription = localizeField(event.metaDescription, locale);
  event.title = localizeField(event.title, locale);

  return event;
};

export const getEventsNearby = async (
  locale = 'en',
  userLat = 43.5343,
  userLon = -5.6615,
  maxDistanceInMeters = 0,
  userId = null, // Add userId parameter
) => {
  try {
    if (!maxDistanceInMeters) maxDistanceInMeters = 40000000; // Default to a large distance if not provided

    let eventsQuery = `
      SELECT
        e.id,
        e.date,
        e.location,
        e.latitude,
        e.longitude,
        e."creatorFarmId",
        e.description,
        e.address,
        e.email,
        e.phone,
        e."isPublic",
        e.title,
        e."metaDescription",
        e."publicationStatus",
        COALESCE(json_agg(mf ORDER BY mf."order") FILTER (WHERE mf.id IS NOT NULL), '[]') as "mediaFiles",
        COALESCE(json_agg(fv) FILTER (WHERE fv.id IS NOT NULL), '[]') as "favorites",
        ST_Distance(
          ST_SetSRID(ST_MakePoint(e.longitude, e.latitude), 4326)::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
        ) AS distance
      FROM
        "Event" e
      LEFT JOIN
        "_MediaFileToEvent" me ON me."A" = e.id
      LEFT JOIN
        "MediaFile" mf ON mf.id = me."B"
      LEFT JOIN
        "Favorite" fv ON fv."eventId" = e.id
      WHERE
        ST_DWithin(
          ST_SetSRID(ST_MakePoint(e.longitude, e.latitude), 4326)::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
          $3::bigint
        )
    `;

    const queryParams = [userLon, userLat, maxDistanceInMeters];

    if (userId) {
      eventsQuery += ` AND fv."userId" = $4`;
      queryParams.push(userId);
    }

    eventsQuery += `
      GROUP BY
        e.id
      ORDER BY
        distance
      LIMIT
        100;
    `;

    const events = await prisma.$queryRawUnsafe(eventsQuery, ...queryParams);

    // Localize fields for each event
    const localizedEvents = events.map((event) => ({
      ...event,
      userLat,
      userLon,
      description: localizeField(event.description, locale),
      metaDescription: localizeField(event.metaDescription, locale),
      title: localizeField(event.title, locale),
      mediaFiles: event.mediaFiles.map((mediaFile) => {
        const { id, url, order, description } = mediaFile;
        return { id, url, order, description };
      }), // No need to sort in JS, should be ordered by SQL
    }));

    return localizedEvents;
  } catch (error) {
    console.error('Error fetching nearby events:', error);
    throw new Error('Failed to fetch nearby events');
  }
};

export const getEventCreatorById = async (eventId) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      mediaFiles: {
        orderBy: {
          order: 'asc', // Ordering media files by 'order' field
        },
      },
    },
  });

  if (!event) {
    throw new Error('Event not found');
  }

  return event.creatorFarm.user;
};
