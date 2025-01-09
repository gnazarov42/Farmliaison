import { createProduct } from '~~/server/db/product';
import { getFarmOwnerBySlug } from '~~/server/db/farm';
import { sanitizeDataForModel } from '~/server/transformers/sanitize';
import { productFields } from '~/server/transformers/product';

export default defineEventHandler(async (event) => {
  const currentUser = event.context.currentUser;
  const { farmSlug, locale } = event.context.params as Record<string, string>;

  try {
    // Check if the current user is the owner of the farm associated with the product
    const farmOwner = await getFarmOwnerBySlug(farmSlug);

    // Handle case where farmOwner is null
    if (!farmOwner) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Farm not found.',
      });
    }

    // Check if the current user is the farm owner or an admin
    if (!currentUser || currentUser.id !== farmOwner.id) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: Only the farm owner can create products.',
      });
    }

    // Assuming the new product data is sent in the request body
    const rawData = await readBody(event);
    const newProductData = sanitizeDataForModel(rawData, productFields); // Use the appropriate fields

    // Create the new product
    const newProduct = await createProduct(farmSlug, newProductData, locale);

    return {
      statusCode: 200,
      body: {
        message: 'Product created successfully',
        product: newProduct,
      },
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode,
      statusMessage: error.statusMessage,
    });
  }
});
