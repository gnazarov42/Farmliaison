// eslint-disable-next-line import/named
import { v2 as _cloudinary } from 'cloudinary';

const cloudinary = () => {
  const config = useRuntimeConfig();

  _cloudinary.config({
    cloud_name: config.public.cloudinaryCloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });

  return _cloudinary;
};

export const uploadToCloudinary = (image) => {
  return new Promise((resolve, reject) => {
    console.log(image);
    cloudinary().uploader.upload(image, (error, data) => {
      if (error) {
        reject(error);
      }
      resolve(data);
    });
  });
};

export const deleteFromCloudinary = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary().uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error('Error deleting image from Cloudinary:', error);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};
