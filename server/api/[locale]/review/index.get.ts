import { getReviewsByEntityId } from '~/server/db/review';

export default defineEventHandler(async (event) => {
  const { locale } = event.context.params as Record<string, string>;
  const entityId = getQuery(event).entityId as string;
  const entityType = getQuery(event).entityType as string; // 'farm', 'event', or 'user'

  try {
    const reviews = await getReviewsByEntityId(entityId, entityType, locale);
    return {
      statusCode: 200,
      body: reviews,
    };
  } catch (error: any) {
    return sendError(
      event,
      createError({ statusCode: 500, statusMessage: error.message }),
    );
  }
});
