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
    const favorite = await prisma.favorite.create({
      data: {
        userId: currentUser.id,
        farmId,
        eventId,
      },
    });
    return {
      statusCode: 200,
      body: favorite,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Unable to add favorite',
    });
  }
});
