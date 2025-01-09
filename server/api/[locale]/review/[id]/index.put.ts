import { updateReview } from '~/server/db/review';
import { sanitizeDataForModel } from '~/server/transformers/sanitize';
import { reviewFields } from '~/server/transformers/review';

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
  const sanitizedData = sanitizeDataForModel(rawData, reviewFields);

  // Validate that the current user is the author of the review
  if (sanitizedData.authorId !== currentUser.id) {
    return sendError(
      event,
      createError({
        statusCode: 403,
        statusMessage: 'You can only update your own reviews.',
      }),
    );
  }

  try {
    const updatedReview = await updateReview(
      reviewId,
      sanitizedData,
      currentUser,
      locale,
    );
    return {
      statusCode: 200,
      body: updatedReview,
    };
  } catch (error: any) {
    return sendError(
      event,
      createError({ statusCode: 403, statusMessage: error.message }),
    );
  }
});
