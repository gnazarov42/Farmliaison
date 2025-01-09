export default defineEventHandler(async (event) => {
  const url = new URL(event.req.url ?? '', 'http://localhost');
  const placeLink = url.searchParams.get('placeLink');

  let placeId;
  let coordinates;

  // Handling URLs from Google Maps links
  if (placeLink.includes('maps.app.goo.gl')) {
    // If the link is a shortened Google Maps link, expand it first
    const response = await fetch(placeLink, {
      method: 'HEAD',
      redirect: 'follow',
    });
    const expandedUrl = response.url;

    const { placeId: extractedPlaceId, coords } =
      await getPlaceIdFromUrl(expandedUrl);
    placeId = extractedPlaceId;
    coordinates = coords;
  } else {
    const { placeId: extractedPlaceId, coords } =
      await getPlaceIdFromUrl(placeLink);
    placeId = extractedPlaceId;
    coordinates = coords;
  }

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

  // Optional: Confirm that the fetched coordinates match the original URL's coordinates
  if (coordinates) {
    const fetchedCoords = data.result.geometry.location;
    if (
      Math.abs(fetchedCoords.lat - coordinates.lat) > 1 ||
      Math.abs(fetchedCoords.lng - coordinates.lng) > 1
    ) {
      return { error: 'Place coordinates do not match' };
    }
  }

  cachedData = {
    response: data,
    timestamp: new Date().getTime(),
  };

  await useStorage('db').setItem(kvKey, cachedData);

  return cachedData.response;
});

async function getPlaceIdFromUrl(placeLink) {
  const url = new URL(placeLink);
  let placeId = null;
  let coordinates = null;

  // Extract place name from URL
  const pathParts = url.pathname.split('/');
  const placeNamePart = pathParts.find((part) => part.includes('place'));

  let placeName = '';
  if (placeNamePart) {
    const nameIndex = pathParts.indexOf(placeNamePart) + 1;
    if (nameIndex < pathParts.length) {
      placeName = decodeURIComponent(pathParts[nameIndex].replace(/\+/g, ' '));
    }
  }

  // Extract coordinates from URL if available
  const latLngMatch = url.pathname.match(/@([\d.-]+),([\d.-]+)/);
  if (latLngMatch) {
    coordinates = {
      lat: parseFloat(latLngMatch[1]),
      lng: parseFloat(latLngMatch[2]),
    };
  }

  if (placeName) {
    // Fetch place ID using place name
    placeId = await fetchPlaceIdFromText(placeName);
  }

  return { placeId, coords: coordinates };
}

async function fetchPlaceIdFromText(placeName) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(placeName)}&inputtype=textquery&fields=place_id&key=${process.env.GOOGLE_API_KEY}`,
  );
  const data = await response.json();

  if (data.candidates && data.candidates.length > 0) {
    return data.candidates[0].place_id;
  }

  return null;
}
