import { getProductsByFarmSlug } from '~~/server/db/product';

export default defineEventHandler(async (event) => {
  const { farmSlug } = event.context.params as Record<string, string>;

  try {
    const products = await getProductsByFarmSlug(farmSlug);

    if (!products || products.length === 0) {
      return {
        statusCode: 404,
        body: {
          message: 'No products found for the specified farm.',
        },
      };
    }

    return {
      statusCode: 200,
      body: {
        products,
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: {
        error: {
          message: 'Internal Server Error',
        },
      },
    };
  }
});
