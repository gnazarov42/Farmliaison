export default defineEventHandler(async (event) => {
  const url = new URL(event.req.url ?? '', 'http://localhost');
  const placeId = url.searchParams.get('placeId');

  if (!placeId) {
    return { error: 'Place ID could not be determined' };
  }

  const kvKey = 'reviews' + placeId;
  let cachedData = await useStorage('db').getItem(kvKey);

  if (cachedData) {
    if (cachedData.timestamp > new Date().getTime() - 1000 * 60 * 60 * 24) {
      return cachedData.response;
    }
  }

  const keyDetails = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,reviews,geometry&key=${process.env.GOOGLE_API_KEY}`,
    {
      method: 'GET',
    },
  );

  const data = await keyDetails.json();

  cachedData = {
    response: data,
    timestamp: new Date().getTime(),
  };

  await useStorage('db').setItem(kvKey, cachedData);

  return cachedData.response;
});
