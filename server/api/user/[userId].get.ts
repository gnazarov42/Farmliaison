import { userTransformer } from '~/server/transformers/user';
import { getUserById } from '~~/server/db/users';

export default defineEventHandler(async (event) => {
  const { userId } = event.context.params as Record<string, string>;
  if (!userId) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing userId',
    });
  }

  const user = await getUserById(userId);

  return {
    user: userTransformer(user),
  };
});
