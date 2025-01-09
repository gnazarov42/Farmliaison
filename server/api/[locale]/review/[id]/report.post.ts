import { reportReview } from '~/server/db/review';
import { sanitizeDataForModel } from '~/server/transformers/sanitize';

export default defineEventHandler(async (event) => {
  const { locale, id: reviewId } = event.context.params as Record<
    string,
    string
  >;
  const currentUser = event.context.currentUser;

  if (!currentUser?.id) {
    return sendError(
      event,
      createError({ statusCode: 401, statusMessage: 'Unauthorized' }),
    );
  }

  const rawData = await readBody(event);
  const sanitizedData = sanitizeDataForModel(rawData, ['reason']);

  try {
    await reportReview(reviewId, sanitizedData.reason, currentUser, locale);
    return {
      statusCode: 200,
      body: { message: 'Review reported successfully' },
    };
  } catch (error: any) {
    return sendError(
      event,
      createError({ statusCode: 403, statusMessage: error.message }),
    );
  }
});
