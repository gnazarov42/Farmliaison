-- DropForeignKey
ALTER TABLE "MediaFile" DROP CONSTRAINT "farmMediaId";

-- DropForeignKey
ALTER TABLE "MediaFile" DROP CONSTRAINT "productMediaId";

-- DropForeignKey
ALTER TABLE "MediaFile" DROP CONSTRAINT "tweetMediaId";

-- CreateTable
CREATE TABLE "_MediaFileToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MediaFileToTweet" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FarmProfileToMediaFile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MediaFileToProduct_AB_unique" ON "_MediaFileToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_MediaFileToProduct_B_index" ON "_MediaFileToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MediaFileToTweet_AB_unique" ON "_MediaFileToTweet"("A", "B");

-- CreateIndex
CREATE INDEX "_MediaFileToTweet_B_index" ON "_MediaFileToTweet"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FarmProfileToMediaFile_AB_unique" ON "_FarmProfileToMediaFile"("A", "B");

-- CreateIndex
CREATE INDEX "_FarmProfileToMediaFile_B_index" ON "_FarmProfileToMediaFile"("B");

-- AddForeignKey
ALTER TABLE "_MediaFileToProduct" ADD CONSTRAINT "_MediaFileToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "MediaFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaFileToProduct" ADD CONSTRAINT "_MediaFileToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaFileToTweet" ADD CONSTRAINT "_MediaFileToTweet_A_fkey" FOREIGN KEY ("A") REFERENCES "MediaFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaFileToTweet" ADD CONSTRAINT "_MediaFileToTweet_B_fkey" FOREIGN KEY ("B") REFERENCES "Tweet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FarmProfileToMediaFile" ADD CONSTRAINT "_FarmProfileToMediaFile_A_fkey" FOREIGN KEY ("A") REFERENCES "FarmProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FarmProfileToMediaFile" ADD CONSTRAINT "_FarmProfileToMediaFile_B_fkey" FOREIGN KEY ("B") REFERENCES "MediaFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
