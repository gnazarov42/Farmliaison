import { farmFields } from '~/server/transformers/farm';
import { sanitizeDataForModel } from '~/server/transformers/sanitize';
import { createFarmProfile } from '~~/server/db/farm';

export default defineEventHandler(async (event) => {
  const { locale } = event.context.params as Record<string, string>;
  console.log(
    '🚀 ~ file: [farmSlug].put.ts:7 ~ defineEventHandler ~ locale:',
    locale,
  );

  const currentUser = event.context.currentUser;

  if (!currentUser?.id) {
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

  const updatedFarm = await createFarmProfile(updatedData, locale);

  return {
    statusCode: 200,
    body: {
      message: 'Farm created successfully',
      farm: updatedFarm,
    },
  };
});
