/*
  Warnings:

  - Made the column `farmSlug` on table `FarmProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "FarmProfile" ALTER COLUMN "farmSlug" SET NOT NULL;
