export const eventFields = [
  'date',
  'location',
  'latitude',
  'longitude',
  'description',
  'address',
  'email',
  'phone',
  'isPublic',
  'title',
  'metaDescription',
  'publicationStatus',
];

export const eventTransformer = (event) => {
  return {
    id: event.id,
    date: event.date,
    location: event.location,
    latitude: event.latitude,
    longitude: event.longitude,
    description: event.description,
    address: event.address,
    email: event.email,
    phone: event.phone,
    isPublic: event.isPublic,
    title: event.title,
    metaDescription: event.metaDescription,
    publicationStatus: event.publicationStatus,
    creatorFarmId: event.creatorFarmId,
    creatorFarm: event.creatorFarm,
    eventHistories: event.eventHistories,
    farmerEvents: event.farmerEvents,
  };
};
