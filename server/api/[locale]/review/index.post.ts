import { createReview } from '~/server/db/review';
import { sanitizeDataForModel } from '~/server/transformers/sanitize';
import { reviewFields } from '~/server/transformers/review';

export default defineEventHandler(async (event) => {
  const { locale } = event.context.params as Record<string, string>;
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
  if (!currentUser.id) {
    return sendError(
      event,
      createError({
        statusCode: 403,
        statusMessage: 'You can only create reviews as the logged-in user.',
      }),
    );
  }

  try {
    const newReview = await createReview(sanitizedData, currentUser.id, locale);
    return {
      statusCode: 201,
      body: newReview,
    };
  } catch (error: any) {
    return sendError(
      event,
      createError({ statusCode: 500, statusMessage: error.message }),
    );
  }
});
