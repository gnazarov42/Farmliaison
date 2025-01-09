import { productFields } from '~/server/transformers/product';
import { updateProduct, getProductById } from '~~/server/db/product';
import { getFarmOwnerBySlug, getFarmProfileBySlug } from '~~/server/db/farm';
import { sanitizeDataForModel } from '~/server/transformers/sanitize'; // Import the sanitizeDataForModel function

export default defineEventHandler(async (event) => {
  const currentUser = event.context.currentUser;
  const { farmSlug, productId, locale } = event.context.params as Record<
    string,
    string
  >;

  // Check if the current user is the owner of the farm associated with the product
  // TODO: need to get rid fo extra request

  const farmOwner = await getFarmOwnerBySlug(farmSlug);

  // Handle case where farmOwner is null
  if (!farmOwner) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Farm not found.',
    }); // Throw a custom error using createError
  }

  if (!currentUser || currentUser.id !== farmOwner.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Only the farm owner can update products.',
    }); // Throw a custom error using createError
  }

  // Assuming the updated product data is sent in the request body
  const rawData = await readBody(event);
  const updatedData = sanitizeDataForModel(rawData, productFields); // Use the appropriate fields

  const existingProduct = await getProductById(productId, farmSlug, locale);
  // TODO: need to get rid fo extra request

  const farm = await getFarmProfileBySlug(farmSlug);

  // Ensure the product belongs to the specified farm
  if (existingProduct?.farmId !== farm?.id) {
    throw createError({
      statusCode: 404,
      statusMessage:
        'Product not found or does not belong to the specified farm.',
    }); // Throw a custom error using createError
  }

  const updatedProduct = await updateProduct(productId, updatedData, locale);
  return {
    statusCode: 200,
    body: {
      message: 'Product updated successfully',
      product: updatedProduct,
    },
  };
});
