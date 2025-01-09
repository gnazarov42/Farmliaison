import { prisma } from '~/server/db';

export default defineEventHandler(async (event) => {
  const currentUser = event.context.currentUser;

  if (!currentUser) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  try {
    const favorites = await prisma.favorite.findMany({
      where: {
        userId: currentUser.id,
      },
      select: {
        farmId: true,
        eventId: true,
      },
    });
    return {
      statusCode: 200,
      body: favorites,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Unable to fetch favorites',
    });
  }
});
