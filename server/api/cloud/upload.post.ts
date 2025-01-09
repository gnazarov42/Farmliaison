import formidable from 'formidable';
import cloudinary from 'cloudinary';

export default defineEventHandler(async (event) => {
  const environmental = useRuntimeConfig();
  //TODO: only authorised user can upload
  //TODO: need to add user data and image alt!
  // Configure Cloudinary with your account details from runtime config
  cloudinary.v2.config({
    cloud_name: environmental.public.cloudinaryCloudName,
    api_key: environmental.cloudinary.apiKey,
    api_secret: environmental.cloudinary.apiSecret,
  });

  return new Promise((resolve, reject) => {
    const form = formidable({});
    form.parse(event.req, async (err, _, files) => {
      if (err) {
        console.error('Formidable parsing error:', err);
        reject({
          statusCode: 500,
          statusMessage: 'Form parsing failed',
          data: err,
        });
      } else {
        const uploadedFilesDetails = []; // Array to hold details of all uploaded files

        try {
          for (const fieldName of Object.keys(files)) {
            const fileArray = files[fieldName];
            if (!fileArray || fileArray.length === 0) continue;

            for (const file of fileArray) {
              if (!file || !file.filepath)
                throw new Error('Invalid file object.');

              const result = await cloudinary.v2.uploader.upload(
                file.filepath,
                {
                  // Optional: Additional Cloudinary upload options here
                },
              );

              // Push both the URL and the entire result object for each uploaded file
              uploadedFilesDetails.push({
                url: result.secure_url, // URL of the uploaded file
                details: result, // Entire result object from Cloudinary
              });
            }
          }

          // Return the details of all uploaded files with statusCode and body
          resolve({
            statusCode: 200,
            body: {
              message: 'Files uploaded successfully',
              uploadedFiles: uploadedFilesDetails,
            },
          });
        } catch (error) {
          console.error('File processing or upload failed:', error);
          reject({
            statusCode: 500,
            statusMessage: 'File processing or upload failed',
            data: error.message,
          });
        }
      }
    });
  });
});
