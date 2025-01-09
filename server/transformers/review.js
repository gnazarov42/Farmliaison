export const reviewFields = [
  'id', // Unique identifier for the review
  'rating', // Rating given by the reviewer
  'content', // Content of the review, possibly in multiple languages
  'response', // Response from the reviewed entity, also in multiple languages
  'pictures', // Array of picture URLs attached to the review
  'createdAt', // Date and time the review was created
  'updatedAt', // Date and time the review was last updated
  'authorId', // Identifier for the author of the review
  'reviewedUserId', // Identifier for the user being reviewed (if applicable)
  'reviewedFarmId', // Identifier for the farm being reviewed (if applicable)
  'reviewedEventId', // Identifier for the event being reviewed (if applicable)
  'publicationStatus', // Status of the review (e.g., PUBLISHED, UNPUBLISHED, DELETED)
];

// Transform the data before storing it in the database
export const transformReviewData = (data) => {
  const transformedData = {};
  reviewFields.forEach((field) => {
    if (data[field] !== undefined) {
      transformedData[field] = data[field];
    }
  });
  return transformedData;
};

// Transform data when retrieving from the database
export const transformReviewForOutput = (data, locale = 'en') => {
  return {
    ...data,
    content: localizeField(data.content, locale, ''),
    response: localizeField(data.response, locale, ''),
  };
};
