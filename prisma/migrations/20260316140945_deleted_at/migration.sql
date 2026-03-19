-- AlterTable
ALTER TABLE "Device" ALTER COLUMN "deletedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Model" ALTER COLUMN "deletedAt" DROP NOT NULL;
