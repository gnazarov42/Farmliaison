import { getActivityById } from '~/server/db/activity';

export default defineEventHandler(async (event) => {
  const { activityId, locale } = event.context.params as Record<string, string>;

  if (!activityId) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing activityId',
    });
  }

  const activity = await getActivityById(activityId, locale);

  return {
    activity,
  };
});
