export const activityFields = ['id', 'name'];

export const activityTransformer = (activity) => {
  return {
    id: activity.id,
    name: activity.name,
  };
};
