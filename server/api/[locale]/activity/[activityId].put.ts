import { activityFields } from '~/server/transformers/activity';
import { sanitizeDataForModel } from '~/server/transformers/sanitize';
import { updateActivity } from '~~/server/db/activity';

export default defineEventHandler(async (event) => {
  const { userId, locale } = event.context.params as Record<string, string>;

  if (!userId) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing userId',
    });
  }
  const currentUser = event.context.currentUser;

  if (currentUser?.id !== userId && !currentUser?.role?.includes('admin')) {
    return sendError(
      event,
      createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      }),
    );
  }

  // Assuming the updated user data is sent in the request body
  const rawData = await readBody(event);
  const updatedData = sanitizeDataForModel(rawData, activityFields);

  const { activityId } = event.context.params as Record<string, string>;
  if (!activityId) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing activityId',
    });
  }

  const updatedActivity = await updateActivity(activityId, updatedData, locale);

  return {
    statusCode: 200,
    body: {
      message: 'Activity updated successfully',
      activity: updatedActivity,
    },
  };
});
