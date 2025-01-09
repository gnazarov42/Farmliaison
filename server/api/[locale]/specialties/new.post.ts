import { specialtyFields } from '~/server/transformers/specialty';
import { sanitizeDataForModel } from '~/server/transformers/sanitize';
import { createSpecialty } from '~/server/db/specialty';

export default defineEventHandler(async (event) => {
  const { locale } = event.context.params as Record<string, string>;

  // const currentUser = event.context.currentUser;

  // if (currentUser?.id !== userId && !currentUser?.role?.includes('admin')) {
  //   return sendError(
  //     event,
  //     createError({
  //       statusCode: 401,
  //       statusMessage: 'Unauthorized',
  //     }),
  //   );
  // }

  // Assuming the updated user data is sent in the request body
  const rawData = await readBody(event);
  const updatedData = sanitizeDataForModel(rawData, specialtyFields);

  const createdSpecialty = await createSpecialty(updatedData, locale);

  return {
    statusCode: 200,
    body: {
      message: 'Specialty created successfully',
      specialty: createdSpecialty,
    },
  };
});
