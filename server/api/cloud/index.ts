import cloudinary from 'cloudinary';
export default defineEventHandler(async (event) => {
  const environmental = useRuntimeConfig();
  //TODO need to utilise this  to work with lost or unwanted images
  interface Results {
    resources: [
      {
        public_id: string;
        context: {
          alt: string;
        };
      },
    ];
  }

  cloudinary.v2.config({
    cloud_name: environmental.public.cloudinaryCloudName,
    api_key: environmental.cloudinary.apiKey,
    api_secret: environmental.cloudinary.apiSecret,
  });

  const data: Results = await cloudinary.v2.search
    .expression('resource_type:image')
    .with_field('context')
    .sort_by('public_id', 'desc')
    .max_results(12)
    .execute();
  return {
    ...data,
  };
});
