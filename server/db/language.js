import { prisma } from '.';

export const getLanguages = () => {
  return prisma.language.findMany({
    select: {
      id: true,
      name: true,
    },
  });
};
