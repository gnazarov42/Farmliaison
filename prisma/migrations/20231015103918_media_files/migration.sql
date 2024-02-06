/*
  Warnings:

  - You are about to drop the column `farmProfileId` on the `MediaFile` table. All the data in the column will be lost.
  - You are about to drop the column `tweetId` on the `MediaFile` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `MediaFile` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "MediaFile" DROP CONSTRAINT "MediaFile_farmProfileId_fkey";

-- DropForeignKey
ALTER TABLE "MediaFile" DROP CONSTRAINT "MediaFile_tweetId_fkey";

-- DropForeignKey
ALTER TABLE "MediaFile" DROP CONSTRAINT "MediaFile_userId_fkey";

-- AlterTable
ALTER TABLE "MediaFile" DROP COLUMN "farmProfileId",
DROP COLUMN "tweetId",
DROP COLUMN "userId",
ADD COLUMN     "propertyId" TEXT;

-- CreateTable
CREATE TABLE "Like" (
    "id" SERIAL NOT NULL,
    "likableId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MediaFile" ADD CONSTRAINT "farmMediaId" FOREIGN KEY ("propertyId") REFERENCES "FarmProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaFile" ADD CONSTRAINT "userMediaId" FOREIGN KEY ("propertyId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaFile" ADD CONSTRAINT "productMediaId" FOREIGN KEY ("propertyId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaFile" ADD CONSTRAINT "tweetMediaId" FOREIGN KEY ("propertyId") REFERENCES "Tweet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "media_likableId" FOREIGN KEY ("likableId") REFERENCES "MediaFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
