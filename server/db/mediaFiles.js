import { prisma } from '.';

export const createMediaFile = (mediaFile, entityType, entityId) => {
  // console.log('🚀 ~ createMediaFile ~ mediaFile:', mediaFile);

  const connectObj = {};
  if (entityId) {
    switch (entityType) {
      case 'farm':
        connectObj.FarmProfile = { connect: { id: entityId } };
        break;
      case 'user':
        connectObj.User = { connect: { id: entityId } };
        break;
      case 'product':
        connectObj.Product = { connect: { id: entityId } };
        break;
      case 'event':
        connectObj.Event = { connect: { id: entityId } };
        break;
      // Add more cases as needed for other entity types
    }
  }

  return prisma.mediaFile.create({
    data: {
      ...mediaFile,
      ...connectObj,
    },
  });
};

export const getMediaFile = (mediaId) => {
  return prisma.mediaFile.findUnique({
    where: { id: mediaId },
  });
};

export const deleteMediaFile = async (id) => {
  // Disconnect relationships for cleaner deletion, but note these should match your schema relations
  await prisma.mediaFile.update({
    where: { id },
    data: {
      FarmProfile: { set: [] },
      Product: { set: [] },
      Event: { set: [] },
      Tweet: { set: [] },
    },
  });

  // Now delete the media file
  return prisma.mediaFile.delete({
    where: { id },
  });
};

/**
 * Updates the order of media files.
 *
 * @param {Array} mediaFiles - An array of objects containing the media file IDs and their new order.
 * @returns {Promise} - A promise that resolves when all updates are completed.
 */
export const updateMediaFileOrder = async (mediaFiles) => {
  try {
    let updatesCount = 0;
    for (const [index, file] of mediaFiles.entries()) {
      if (file.order !== index) {
        // Check if the index is different from the current order
        await prisma.mediaFile.update({
          where: { id: file.id },
          data: { order: index },
        });
        updatesCount++; // Increment updates counter if an update is made
      }
    }
    return {
      success: true,
      message: `${updatesCount} media file(s) order updated successfully.`,
    };
  } catch (error) {
    console.error('Error updating media file orders:', error);
    throw new Error('Failed to update media file orders');
  }
};
