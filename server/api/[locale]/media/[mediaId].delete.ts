import { deleteMediaFile, getMediaFile } from '~/server/db/mediaFiles';
import { deleteFromCloudinary } from '~/server/utils/cloudinary';

export default defineEventHandler(async (event) => {
  const { mediaId } = event.context.params as Record<string, string>;
  const currentUser = event.context.currentUser;

  if (!currentUser) {
    throw createError({ statusCode: 500, statusMessage: 'Missing userId' });
  }

  const mediaFile = await getMediaFile(mediaId);

  if (!mediaFile) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Media file not found',
    });
  }

  // Check if the user is the author or an admin
  if (
    mediaFile.authorId !== currentUser.id &&
    !currentUser.role.includes('admin')
  ) {
    return sendError(
      event,
      createError({ statusCode: 401, statusMessage: 'Unauthorized' }),
    );
  }

  const deletedMediaFile = await deleteMediaFile(mediaId);

  try {
    await deleteFromCloudinary(mediaFile.providerPublicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);

    // Optionally, you can choose to reinsert the file information back to the database and notify the error.
    // Add logic here if you want to handle Cloudinary deletion failure specifically.
  }

  return {
    statusCode: 200,
    body: {
      message: 'MediaFile deleted successfully',
      mediaFile: deletedMediaFile,
    },
  };
});
