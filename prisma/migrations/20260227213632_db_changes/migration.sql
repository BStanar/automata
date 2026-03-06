/*
  Warnings:

  - You are about to drop the column `installationLocation` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `findings` on the `work_order_devices` table. All the data in the column will be lost.
  - You are about to drop the column `recommendations` on the `work_order_devices` table. All the data in the column will be lost.
  - Added the required column `installatuonMainAdress` to the `Device` table without a default value. This is not possible if the table is not empty.
  - Made the column `acceptingDescription` on table `work_orders` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Device" DROP COLUMN "installationLocation",
ADD COLUMN     "installationLocationAdress" TEXT,
ADD COLUMN     "installationLocationCity" TEXT,
ADD COLUMN     "installatuonMainAdress" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT;

-- AlterTable
ALTER TABLE "work_order_devices" DROP COLUMN "findings",
DROP COLUMN "recommendations";

-- AlterTable
ALTER TABLE "work_orders" ALTER COLUMN "acceptingDescription" SET NOT NULL;
