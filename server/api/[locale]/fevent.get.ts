import { getEventsNearby } from '~~/server/db/events';
// import { eventTransformer } from '~/server/transformers/event';

export default defineEventHandler(async (event) => {
  const { locale } = event.context.params as Record<string, string>;
  const query = getQuery(event);

  const currentUser = event.context.currentUser;

  // Convert query parameters to appropriate types
  const parsedLatitude =
    typeof query.latitude === 'string' ? parseFloat(query.latitude) : 43.5343; // Default latitude if undefined or not a number
  const parsedLongitude =
    typeof query.longitude === 'string' ? parseFloat(query.longitude) : -5.6615; // Default longitude if undefined or not a number
  const parsedProximity =
    typeof query.proximity === 'string' ? parseFloat(query.proximity) : 0; // Default to 0 if proximity is undefined or not a number
  const favoritesOnly =
    typeof query.favoritesOnly === 'string' && query.favoritesOnly === 'true'; // Check if favoritesOnly is set

  // Debugging output
  const debugInfo = {
    receivedQuery: query,
    parsedLatitude,
    parsedLongitude,
    parsedProximity,
  };

  try {
    const events = await getEventsNearby(
      locale,
      parsedLatitude,
      parsedLongitude,
      parsedProximity,
      favoritesOnly ? currentUser?.id : null, // Pass userId only if favoritesOnly is true
    );

    // const transformedEvents = events.map(eventTransformer);

    return {
      statusCode: 200,
      body: {
        events: events,
        debug: debugInfo,
      },
    };
  } catch (error) {
    console.error('An error occurred while fetching events:', error);
    return {
      statusCode: 500,
      body: {
        error: 'Internal Server Error',
        debug: debugInfo,
      },
    };
  }
});
