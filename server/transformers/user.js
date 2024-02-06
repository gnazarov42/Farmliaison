export const userFields = [
  'id',
  'email',
  'password',
  'name',
  'picture',
  'createdAt',
  'updatedAt',
  'phone',
  'profileImage',
  'username',
  'role',
  'type',
];

export const userTransformer = (user) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    phone: user.phone,
    profileImage: user.profileImage,
    picture: user.picture,
    handle: '@' + user.username,
    type: user.type,
  };
};
