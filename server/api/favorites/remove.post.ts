import { prisma } from '~/server/db';

export default defineEventHandler(async (event) => {
  const currentUser = event.context.currentUser;

  if (!currentUser) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  const { farmId, eventId } = await readBody(event);

  try {
    await prisma.favorite.deleteMany({
      where: {
        userId: currentUser.id,
        farmId,
        eventId,
      },
    });
    return {
      statusCode: 200,
      body: { message: 'Favorite removed' },
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Unable to remove favorite',
    });
  }
});
