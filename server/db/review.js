import { prepareLocalizedJsonUpdate, localizeField } from './utils';
import { prisma } from '.';

export const createReview = async (data, userId, locale = 'en') => {
  try {
    // Check if the user is trying to review themselves or their own farm
    if (data.reviewedUserId && data.reviewedUserId === userId) {
      throw new Error('You cannot review yourself.');
    }

    if (data.reviewedFarmId) {
      const userFarm = await prisma.farmProfile.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (userFarm && userFarm.id === data.reviewedFarmId) {
        throw new Error('You cannot review your own farm.');
      }
    }

    // Construct the conditions for the OR clause based on the provided entity IDs
    const conditions = [];

    if (data.reviewedFarmId) {
      conditions.push({ reviewedFarmId: data.reviewedFarmId });
    }
    if (data.reviewedUserId) {
      conditions.push({ reviewedUserId: data.reviewedUserId });
    }
    if (data.reviewedEventId) {
      conditions.push({ reviewedEventId: data.reviewedEventId });
    }

    // Check if the user has already reviewed this entity
    const existingReview = await prisma.review.findFirst({
      where: {
        authorId: userId,
        OR: conditions,
      },
    });

    if (existingReview) {
      throw new Error('You have already reviewed this entity.');
    }

    // Prepare localized fields for content
    const translatedData = await prepareLocalizedJsonUpdate(locale, {
      content: data.content,
    });

    // Define the connection to the correct entity (farm, user, or event)
    const reviewData = {
      rating: data.rating,
      content: translatedData.content,
      pictures: data.pictures || [],
      authorId: userId, // Associate review with the author
      reviewedFarmId: data.reviewedFarmId || null,
      reviewedUserId: data.reviewedUserId || null,
      reviewedEventId: data.reviewedEventId || null,
      publicationStatus: 'PUBLISHED', // Default to published just for now
    };

    const newReview = await prisma.review.create({
      data: reviewData,
      select: {
        id: true,
        rating: true,
        content: true,
        pictures: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });

    return {
      ...newReview,
      content: localizeField(newReview.content, locale),
      response: localizeField(newReview.response, locale),
    };
  } catch (error) {
    console.error('Error creating review:', error);
    throw new Error('Failed to create review');
  }
};

export const getReviewByIdWithValidation = async (
  reviewId,
  currentUser,
  forResponse = false,
) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: {
      id: true,
      authorId: true,
      reviewedUserId: true,
      reviewedFarm: {
        select: { userId: true },
      },
      reviewedEvent: {
        select: { creatorFarm: { select: { userId: true } } },
      },
    },
  });

  if (!review) {
    throw new Error('Review not found');
  }

  // If validating for response, check if the current user is the reviewed entity owner
  if (forResponse) {
    const isAuthorizedToRespond =
      review.reviewedUserId === currentUser.id ||
      review.reviewedFarm?.userId === currentUser.id ||
      review.reviewedEvent?.creatorFarm?.userId === currentUser.id;

    if (!isAuthorizedToRespond) {
      throw new Error(
        'You can only respond to reviews for your own profile or events.',
      );
    }
  } else {
    // If validating for review creation or update, ensure the current user is the author
    if (review.authorId !== currentUser.id) {
      throw new Error('You can only update or delete your own reviews.');
    }
  }

  return review;
};

export const addResponseToReview = async (
  reviewId,
  response,
  currentUser,
  locale = 'en',
) => {
  try {
    // Validate the review and permissions
    const review = await getReviewByIdWithValidation(
      reviewId,
      currentUser,
      true,
    );

    // Prepare localized fields for the response
    const translatedResponse = await prepareLocalizedJsonUpdate(
      locale,
      { response },
      { response: review.response },
    );

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        response: translatedResponse.response,
      },
      select: {
        id: true,
        response: true,
        updatedAt: true,
      },
    });

    return updatedReview;
  } catch (error) {
    console.error('Error adding response to review:', error);
    throw new Error('Failed to add response to review');
  }
};

export const updateResponseToReview = async (
  reviewId,
  response,
  currentUser,
  locale = 'en',
) => {
  try {
    // Validate the review and permissions
    const review = await getReviewByIdWithValidation(
      reviewId,
      currentUser,
      true,
    );

    // Prepare localized fields for the response
    const translatedResponse = await prepareLocalizedJsonUpdate(
      locale,
      { response },
      { response: review.response },
    );

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        response: translatedResponse.response,
      },
      select: {
        id: true,
        response: true,
        updatedAt: true,
      },
    });

    return updatedReview;
  } catch (error) {
    console.error('Error updating response to review:', error);
    throw new Error('Failed to update response to review');
  }
};

export const updateReview = async (
  reviewId,
  data,
  currentUser,
  locale = 'en',
) => {
  try {
    const review = await getReviewByIdWithValidation(reviewId, currentUser);

    // Prepare localized fields for content
    const translatedData = await prepareLocalizedJsonUpdate(
      locale,
      { content: data.content },
      { content: review.content },
    );

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: data.rating,
        content: translatedData.content,
        pictures: data.pictures || [],
      },
      select: {
        id: true,
        rating: true,
        content: true,
        pictures: true,
        updatedAt: true,
      },
    });

    return updatedReview;
  } catch (error) {
    console.error('Error updating review:', error);
    throw new Error('Failed to update review');
  }
};

export const deleteReview = async (reviewId, currentUser) => {
  try {
    await getReviewByIdWithValidation(reviewId, currentUser);

    await prisma.review.update({
      where: { id: reviewId },
      data: {
        publicationStatus: 'DELETED', // Mark the review as deleted
      },
      select: {
        id: true,
        publicationStatus: true,
      },
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    throw new Error('Failed to delete review');
  }
};

export const getReviewsByEntityId = async (
  entityId,
  entityType,
  locale = 'en',
) => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        [`reviewed${capitalize(entityType)}Id`]: entityId,
        publicationStatus: 'PUBLISHED',
      },
      select: {
        id: true,
        rating: true,
        content: true,
        response: true,
        pictures: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Localize fields for each review
    return reviews.map((review) => ({
      ...review,
      content: localizeField(review.content, locale),
      response: localizeField(review.response, locale),
    }));
  } catch (error) {
    console.error(`Error fetching reviews for ${entityType}:`, error);
    throw new Error(`Failed to fetch reviews for ${entityType}`);
  }
};

export const reportReview = async (
  reviewId,
  reason,
  currentUser,
  locale = 'en',
) => {
  try {
    // Fetch the review and validate that the current user has the right to report it
    const review = await getReviewByIdWithValidation(
      reviewId,
      currentUser,
      true,
    );

    // Log the report in the database (could be added to a `ReportedReviews` table or logged otherwise)
    const reportLog = await prisma.reportedReview.create({
      data: {
        reviewId,
        reportedById: currentUser.id,
        reportReason: reason,
        reportedAt: new Date(),
      },
      select: {
        id: true,
        reviewId: true,
        reportReason: true,
        reportedAt: true,
      },
    });

    // Simulate sending an email notification to the admin
    console.log(
      `Admin notified about report on review ${reviewId} by user ${currentUser.id}`,
    );

    return reportLog;
  } catch (error) {
    console.error('Error reporting review:', error);
    throw new Error('Failed to report review');
  }
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
