export const mediaFields = [
  'id',
  'url',
  'authorId',
  'providerPublicId',
  'propertyId',
  'metadata',
  'entityId',
  'entityType',
];

export const mediaFileTransformer = (mediaFile) => {
  return {
    id: mediaFile.id,
    url: mediaFile.url,
    authorId: mediaFile.authorId,
    providerPublicId: mediaFile.providerPublicId,
    propertyId: mediaFile.propertyId,
    metadata: mediaFile.metadata,
    entityType: mediaFile.entityType, // Ensure entityType is included in the transformed object
    entityId: mediaFile.entityId, // Ensure entityId is included in the transformed object
  };
};
