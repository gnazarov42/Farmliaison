import { farmFields } from '~/server/transformers/farm';
import { sanitizeDataForModel } from '~/server/transformers/sanitize';
import { getFarmOwnerBySlug, updateFarmProfile } from '~~/server/db/farm';

export default defineEventHandler(async (event) => {
  const { locale, farmSlug } = event.context.params as Record<string, string>;

  const currentUser = event.context.currentUser;

  const farmOwner = await getFarmOwnerBySlug(farmSlug);
  if (!currentUser) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing userId',
    });
  }

  if (
    currentUser?.id !== farmOwner.id &&
    !currentUser?.role?.includes('admin')
  ) {
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

  const updatedFarm = await updateFarmProfile(farmSlug, updatedData, locale);

  return {
    statusCode: 200,
    body: {
      message: 'Farm updated successfully',
      farm: updatedFarm,
    },
  };
});
