import { deleteReview } from '~/server/db/review';

export default defineEventHandler(async (event) => {
  const { id: reviewId } = event.context.params as Record<string, string>;
  const currentUser = event.context.currentUser;

  if (!currentUser?.id) {
    return sendError(
      event,
      createError({ statusCode: 401, statusMessage: 'Unauthorized' }),
    );
  }

  try {
    await deleteReview(reviewId, currentUser);
    return {
      statusCode: 200,
      body: { message: 'Review deleted successfully' },
    };
  } catch (error: any) {
    return sendError(
      event,
      createError({ statusCode: 403, statusMessage: error.message }),
    );
  }
});
