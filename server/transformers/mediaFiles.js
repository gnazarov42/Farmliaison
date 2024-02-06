export const mediaFields = [
  'id',
  'url',
  'authorId',
  'providerPublicId',
  'propertyId',
];

export const mediaFileTransformer = (mediFile) => {
  return {
    id: mediFile.id,
    url: mediFile.url,
  };
};
