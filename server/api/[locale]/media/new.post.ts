import { mediaFields } from '~/server/transformers/mediaFiles';
import { sanitizeDataForModel } from '~/server/transformers/sanityze'; // Import your data sanitization functions
import { createMediaFile } from '~~/server/db/mediaFiles'; // Import your Prisma database functions for MediaFile

export default defineEventHandler(async (event) => {
  // Handle different HTTP methods (POST, GET, PUT, DELETE) for MediaFile
  // Create a new MediaFile
  const rawData = await readBody(event); // Read the request body
  const updatedData = sanitizeDataForModel(rawData, mediaFields); // Sanitize the data
  const createdMediaFile = await createMediaFile(updatedData);

  return {
    statusCode: 200,
    body: {
      message: 'MediaFile created successfully',
      mediaFile: createdMediaFile,
    },
  };

  // Add similar logic for other HTTP methods (GET, PUT, DELETE) for MediaFile endpoints as in the provided example.
});
