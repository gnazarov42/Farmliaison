import { mediaFields } from '~/server/transformers/mediaFiles';
import { sanitizeDataForModel } from '~/server/transformers/sanitize'; // Import your data sanitization functions
import { createMediaFile } from '~/server/db/mediaFiles'; // Import your Prisma database functions for MediaFile

export default defineEventHandler(async (event) => {
  // Handle different HTTP methods (POST, GET, PUT, DELETE) for MediaFile
  // Create a new MediaFile
  // TODO: Need to check if the user authorized
  const currentUser = event.context.currentUser;
  if (!currentUser) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing userId',
    });
  }
  const rawData = await readBody(event);
  const { entityType, entityId, ...mediaData } = sanitizeDataForModel(
    rawData,
    mediaFields,
  );

  // Pass entityType and entityId to the createMediaFile function
  const createdMediaFile = await createMediaFile(
    mediaData,
    entityType,
    entityId,
  );

  return {
    statusCode: 200,
    body: {
      message: 'MediaFile created successfully',
      mediaFile: createdMediaFile,
    },
  };
});
