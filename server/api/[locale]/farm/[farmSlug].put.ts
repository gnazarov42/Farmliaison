import { farmFields } from '~/server/transformers/farm';
import { sanitizeDataForModel } from '~/server/transformers/sanityze';
import { getFarmOwnerBySlug, updateFarmProfile } from '~~/server/db/farm';

export default defineEventHandler(async (event) => {
  const { locale, farmSlug } = event.context.params as Record<string, string>;
  console.log(
    '🚀 ~ file: [farmSlug].put.ts:7 ~ defineEventHandler ~ locale:',
    locale,
  );

  const currentUser = event.context.currentUser;

  const farmOwner = getFarmOwnerBySlug(farmSlug);
  if (!currentUser) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing userId',
    });
  }

  if (currentUser?.id !== farmOwner && !currentUser?.role?.includes('admin')) {
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
  const updatedData = sanitizeDataForModel(rawData, farmFields);

  const updatedFarm = await updateFarmProfile(farmSlug, updatedData);

  return {
    statusCode: 200,
    body: {
      message: 'Farm updated successfully',
      farm: updatedFarm,
    },
  };
});
