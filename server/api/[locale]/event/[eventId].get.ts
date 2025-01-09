import { getEventDetails } from '~~/server/db/events';
// import { eventTransformer } from '~/server/transformers/event';

export default defineEventHandler(async (event) => {
  const { eventId, locale } = event.context.params as Record<string, string>;
  if (!eventId) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing eventId',
    });
  }

  const eventDetails = await getEventDetails(eventId, locale);

  return eventDetails;

  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve(eventTransformer(eventDetails));
  //   }, 0); // delay for testing, remove for production
  // });
});
