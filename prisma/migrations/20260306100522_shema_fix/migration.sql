/*
  Warnings:

  - You are about to drop the column `installationLocationAdress` on the `Device` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Device" DROP COLUMN "installationLocationAdress",
ADD COLUMN     "installationLocationAddress" TEXT,
ALTER COLUMN "usesMainAddress" SET DEFAULT true;
