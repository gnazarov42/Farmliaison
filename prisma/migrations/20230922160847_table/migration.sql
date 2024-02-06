/*
  Warnings:

  - You are about to drop the column `activityTypeId` on the `FarmActivity` table. All the data in the column will be lost.
  - You are about to drop the `ActivityType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `activityId` to the `FarmActivity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FarmActivity" DROP CONSTRAINT "FarmActivity_activityTypeId_fkey";

-- AlterTable
ALTER TABLE "FarmActivity" DROP COLUMN "activityTypeId",
ADD COLUMN     "activityId" TEXT NOT NULL;

-- DropTable
DROP TABLE "ActivityType";

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" JSONB NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FarmActivity" ADD CONSTRAINT "FarmActivity_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
