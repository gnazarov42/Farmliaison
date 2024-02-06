import bcrypt from 'bcrypt';
import { prisma } from '.';

export const createUser = (userData) => {
  const finalUserData = {
    ...userData,
    password: bcrypt.hashSync(userData.password, 10),
  };

  return prisma.user.create({
    data: finalUserData,
  });
};

export const getUserByUsername = (username) => {
  return prisma.user.findUnique({
    where: {
      username,
    },
  });
};

export const getUserByEmail = (email) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const getUserById = (userId) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
};

export const updateUser = (userId, updatedData) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: updatedData,
  });
};
