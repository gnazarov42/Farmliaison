-- AlterTable
ALTER TABLE "MediaFile" ADD COLUMN     "farmProfileId" TEXT;

-- AddForeignKey
ALTER TABLE "MediaFile" ADD CONSTRAINT "MediaFile_farmProfileId_fkey" FOREIGN KEY ("farmProfileId") REFERENCES "FarmProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
