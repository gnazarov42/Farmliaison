import { eventFields } from '~/server/transformers/event';
import { sanitizeDataForModel } from '~/server/transformers/sanitize';
import { createEvent } from '~~/server/db/events';

export default defineEventHandler(async (event) => {
  const { locale } = event.context.params as Record<string, string>;
  const currentUser = event.context.currentUser;

  // Log currentUser to verify farmSlug is present
  console.log('Current User:', currentUser);

  if (!currentUser?.id) {
    return sendError(
      event,
      createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      }),
    );
  }

  if (!currentUser.farmSlug) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: 'Current user does not have a farmSlug',
      }),
    );
  }

  const rawData = await readBody(event);
  const sanitizedData = sanitizeDataForModel(rawData, eventFields);

  const newEvent = await createEvent(
    { ...sanitizedData, farmSlug: currentUser.farmSlug },
    locale,
  );

  return {
    statusCode: 200,
    body: {
      message: 'Event created successfully',
      event: newEvent,
    },
  };
});
