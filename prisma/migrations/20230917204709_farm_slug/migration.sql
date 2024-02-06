/*
  Warnings:

  - A unique constraint covering the columns `[farmSlug]` on the table `FarmProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "FarmProfile" ADD COLUMN     "farmSlug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "FarmProfile_farmSlug_key" ON "FarmProfile"("farmSlug");
