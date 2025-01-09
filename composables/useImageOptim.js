export const useImageOptim = (url, options = 'q_auto,f_auto') => {
  // Check if the URL is from Cloudinary
  if (url && url.includes('cloudinary.com')) {
    const parts = url.split('/');

    // Find the index where "upload" is located in the URL
    const uploadIndex = parts.indexOf('upload');

    // If 'upload' is found and there's room to add options
    if (uploadIndex !== -1 && uploadIndex + 1 < parts.length) {
      // Insert the options right after 'upload'
      parts.splice(uploadIndex + 1, 0, options);
      // Return the modified URL
      return parts.join('/');
    }
  }
  // Return the original URL if not a Cloudinary URL or no modification is needed
  return url;
};
