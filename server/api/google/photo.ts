const serverKey = process.env.GOOGLE_API_KEY;

const resolvePhoto = async (photoReference) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${serverKey}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch photo. Status: ${response.status}`);
    }
    // Get the URL from the response
    const photoUrl = response.url;
    return photoUrl;
  } catch (error) {
    console.error('Error fetching photo:', error);
    throw error; // Rethrow the error to be handled by the calling code
  }
};

export default defineEventHandler(async (event) => {
  try {
    const url = new URL(event.req.url ?? '', 'http://localhost');
    const photoReference = url.searchParams.get('photoReference');

    if (!photoReference) {
      throw new Error('Missing photoReference parameter');
    }

    const photoUrl = await resolvePhoto(photoReference);
    return { photoUrl };
  } catch (error) {
    console.error('Error in event handler:', error);
    return { error: error.message }; // Return an error response
  }
});
