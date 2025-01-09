import { eventFields } from '~/server/transformers/event';
import { sanitizeDataForModel } from '~/server/transformers/sanitize';
import { getEventCreatorById, updateEvent } from '~~/server/db/events';

export default defineEventHandler(async (event) => {
  const { locale, eventId } = event.context.params as Record<string, string>;

  const currentUser = event.context.currentUser;

  const eventCreator = await getEventCreatorById(eventId);
  if (!currentUser) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing userId',
    });
  }

  if (
    currentUser?.id !== eventCreator.id &&
    !currentUser?.role?.includes('admin')
  ) {
    return sendError(
      event,
      createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      }),
    );
  }

  // Assuming the updated event data is sent in the request body
  const rawData = await readBody(event);
  const updatedData = sanitizeDataForModel(rawData, eventFields);

  const updatedEvent = await updateEvent(eventId, updatedData, locale);

  return {
    statusCode: 200,
    body: {
      message: 'Event updated successfully',
      event: updatedEvent,
    },
  };
});
