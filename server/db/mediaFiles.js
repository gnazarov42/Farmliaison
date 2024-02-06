import { prisma } from '.';

export const createMediaFile = (mediaFile) => {
  console.log(
    '🚀 ~ file: mediaFiles.js:5 ~ createMediaFile ~ mediaFile:',
    mediaFile,
  );
  return prisma.mediaFile.create({
    data: mediaFile,
  });
};
