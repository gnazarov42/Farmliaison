// import { userTransformer } from '~/server/transformers/user';
import { getFarmProfileBySlug } from '~~/server/db/farm';

export default defineEventHandler(async (event) => {
  const { farmSlug } = event.context.params as Record<string, string>;
  if (!farmSlug) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing farmSlug',
    });
  }

  const farm = await getFarmProfileBySlug(farmSlug);

  return {
    farm,
  };
});
