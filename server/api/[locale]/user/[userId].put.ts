import { userTransformer, userFields } from '~/server/transformers/user';
import { sanitizeDataForModel } from '~/server/transformers/sanitize';
import { updateUser } from '~~/server/db/users';

export default defineEventHandler(async (event) => {
  const { userId, locale } = event.context.params as Record<string, string>;
  if (!userId) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing userId',
    });
  }
  const currentUser = event.context.currentUser;

  if (currentUser?.id !== userId) {
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
  const updatedData = sanitizeDataForModel(rawData, userFields);

  // Exclude certain fields from the update for security, like 'password'
  if (updatedData.password) {
    delete updatedData.password;
  }

  const updatedUser = await updateUser(userId, updatedData, locale);

  return {
    statusCode: 200,
    body: {
      message: 'User updated successfully',
      user: userTransformer(updatedUser),
    },
  };
});
