export const specialtyFields = ['id', 'name'];

export const specialtyTransformer = (specialty) => {
  return {
    id: specialty.id,
    name: specialty.name,
  };
};
