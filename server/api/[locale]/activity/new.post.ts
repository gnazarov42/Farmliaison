import { activityFields } from '~/server/transformers/activity';
import { sanitizeDataForModel } from '~/server/transformers/sanityze';
import { createActivity } from '~~/server/db/activity';

export default defineEventHandler(async (event) => {
  const { locale } = event.context.params as Record<string, string>;

  // const currentUser = event.context.currentUser;

  // if (currentUser?.id !== userId && !currentUser?.role?.includes('admin')) {
  //   return sendError(
  //     event,
  //     createError({
  //       statusCode: 401,
  //       statusMessage: 'Unauthorized',
  //     }),
  //   );
  // }

  // Assuming the updated user data is sent in the request body
  const rawData = await readBody(event);
  const updatedData = sanitizeDataForModel(rawData, activityFields);

  const createdActivity = await createActivity(updatedData, locale);

  return {
    statusCode: 200,
    body: {
      message: 'Activity updated successfully',
      activity: createdActivity,
    },
  };
});
