import { getFarmOwnerBySlug, getFarmProfileBySlug } from '~~/server/db/farm';
import { getProductById, deleteProductById } from '~~/server/db/product';

export default defineEventHandler(async (event) => {
  const currentUser = event.context.currentUser;
  const { farmSlug, productId, locale } = event.context.params as Record<
    string,
    string
  >;

  const farmOwner = await getFarmOwnerBySlug(farmSlug);

  if (!farmOwner) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Farm not found.',
    });
  }

  if (!currentUser || currentUser.id !== farmOwner.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Only the farm owner can delete products.',
    });
  }

  const existingProduct = await getProductById(productId, farmSlug, locale);

  if (!existingProduct) {
    throw createError({
      statusCode: 404,
      statusMessage:
        'Product not found or does not belong to the specified farm.',
    });
  }

  await deleteProductById(productId, farmSlug, locale);

  return {
    statusCode: 200,
    body: {
      message: 'Product deleted successfully',
    },
  };
});
