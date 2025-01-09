import { getProductById } from '~~/server/db/product';

export default defineEventHandler(async (event) => {
  const { farmSlug, productId, locale } = event.context.params as Record<
    string,
    string
  >;

  try {
    const product = await getProductById(productId, farmSlug, locale);

    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found.',
      });
    }

    return {
      statusCode: 200,
      body: {
        product,
      },
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }
});
