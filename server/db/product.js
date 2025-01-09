import { prepareLocalizedJsonUpdate, localizeField } from './utils';
import { updateMediaFileOrder, deleteMediaFile } from './mediaFiles';
import { deleteFromCloudinary } from '~/server/utils/cloudinary';

import { prisma } from '.';

// Import utility functions

export const createProduct = async (farmSlug, data, locale = 'en') => {
  try {
    // Prepare localized fields if applicable
    const localizedData = await prepareLocalizedJsonUpdate(
      locale,
      { description: data.description, name: data.name },
      {},
    );

    const newProduct = await prisma.product.create({
      data: {
        ...data,
        ...localizedData,
        farm: {
          connect: {
            farmSlug,
          },
        },
      },
    });
    return newProduct;
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('Failed to create product');
  }
};

export const getProductById = async (productId, farmSlug, locale = 'en') => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
        farm: {
          farmSlug: farmSlug,
        },
      },
      include: {
        farm: true, // Include farm data in the response
        mediaFiles: {
          orderBy: {
            order: 'asc', // Ordering media files by 'order' field
          },
        },
      },
    });
    const farmOwnerId = product?.farm.userId;
    delete product?.farm;
    return product
      ? {
          ...product,
          farmOwnerId,
          name: locale ? localizeField(product.name, locale, '') : product.name,
          description: locale
            ? localizeField(product.description, locale, '')
            : product.description,
        }
      : null;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw new Error('Failed to fetch product');
  }
};

export const updateProduct = async (productId, data, locale = 'en') => {
  try {
    // Update the order of media files if provided
    if (data.mediaFiles && Array.isArray(data.mediaFiles)) {
      await updateMediaFileOrder(data.mediaFiles);
    }
  } catch (error) {
    console.error('Error updating media file order:', error);
  }

  try {
    // Prepare localized fields if applicable

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    // Prepare the description with updated source locale and translations for missing locales
    let translatedData = {
      description: product.description,
      name: product.name,
    };
    if (
      (translatedData?.description &&
        data.description !== translatedData?.description[locale]) ||
      (translatedData?.name && data.name !== translatedData?.name[locale]) ||
      !data.translateAll
    ) {
      // update only current locale and translate missing locales
      translatedData = await prepareLocalizedJsonUpdate(
        locale,
        {
          description: data.description,
          name: data.name,
        },
        {
          description: product.description,
          name: product.name,
        },
      );
    } else {
      // update current locale and translate all locales
      translatedData = await prepareLocalizedJsonUpdate(locale, {
        description: data.description,
        name: data.name,
      });
    }

    delete data.translateAll;
    delete data.mediaFiles;

    // Update product data including localized fields
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...data,
        ...translatedData,
      },
    });

    return updatedProduct;
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }
};

export const deleteProductById = async (productId, farmSlug, locale = 'en') => {
  try {
    // Fetch the product with its media files using getProductById
    const product = await getProductById(productId, farmSlug, locale);

    if (!product) {
      throw new Error('Product not found');
    }

    // Delete each media file from the database and Cloudinary
    for (const mediaFile of product.mediaFiles) {
      await deleteMediaFile(mediaFile.id);
      try {
        await deleteFromCloudinary(mediaFile.providerPublicId);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        // Optionally, handle Cloudinary deletion failure
      }
    }

    // Delete the product from the database
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
};

export const getProductsByFarmSlug = async (farmSlug, locale = 'en') => {
  try {
    const products = await prisma.product.findMany({
      where: {
        farm: {
          farmSlug,
        },
      },
    });
    const locProducts = products.map((product) => {
      return {
        ...product,
        name: localizeField(product.name, locale, ''),
        description: localizeField(product.description, locale, ''),
      };
    });
    return locProducts;
  } catch (error) {
    console.error('Error fetching products by farm slug:', error);
    throw new Error('Failed to fetch products by farm slug');
  }
};
