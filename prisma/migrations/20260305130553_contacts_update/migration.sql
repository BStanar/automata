/*
  Warnings:

  - You are about to drop the column `installatuonMainAdress` on the `Device` table. All the data in the column will be lost.
  - Added the required column `usesMainAddress` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Device" DROP COLUMN "installatuonMainAdress",
ADD COLUMN     "usesMainAddress" BOOLEAN NOT NULL;
