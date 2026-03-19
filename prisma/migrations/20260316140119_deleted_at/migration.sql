/*
  Warnings:

  - Added the required column `deletedAt` to the `Device` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deletedAt` to the `Model` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "deletedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Model" ADD COLUMN     "deletedAt" TIMESTAMP(3) NOT NULL;
