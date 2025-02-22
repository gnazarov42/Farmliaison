/*
  Warnings:

  - Added the required column `authorId` to the `MediaFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MediaFile" ADD COLUMN     "authorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "MediaFile" ADD CONSTRAINT "MediaFile_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
