/*
  Warnings:

  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `Workflow` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `firstName` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMINISTRATOR', 'SERVICE_PERSON');

-- CreateEnum
CREATE TYPE "ContactRole" AS ENUM ('TECHNICAL', 'SALES', 'ADMIN');

-- CreateEnum
CREATE TYPE "ContactOwnerType" AS ENUM ('CLIENT', 'MANUFACTURER');

-- CreateEnum
CREATE TYPE "RegulatoryStatus" AS ENUM ('ACTIVE', 'OBSOLETE', 'END_OF_LIFE');

-- CreateEnum
CREATE TYPE "SubstitutionType" AS ENUM ('TEMPORARY', 'PERMANENT', 'OEM_APPROVED');

-- CreateEnum
CREATE TYPE "WorkOrderStatus" AS ENUM ('OPEN', 'PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentTerm" AS ENUM ('IMMEDIATE', 'LATER', 'NOPAYMENT');

-- CreateEnum
CREATE TYPE "WorkOrderServiceAssignmentRole" AS ENUM ('PRIMARY', 'SECONDARY');

-- CreateEnum
CREATE TYPE "WorkOrderType" AS ENUM ('DIAGNOSTIC', 'PREVENTIVE', 'INTERVENTION', 'INSTALLATION', 'TRAINING', 'INSTALLATION_AND_TRAINING', 'DIAGNOSTIC_AND_INTERVENTION', 'WARRANTY_SERVICE');

-- DropForeignKey
ALTER TABLE "Workflow" DROP CONSTRAINT "Workflow_userId_fkey";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "role" "UserRole" NOT NULL;

-- DropTable
DROP TABLE "Workflow";

-- CreateTable
CREATE TABLE "workflow" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "workflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "registrationNumber" TEXT,
    "vatNumber" TEXT,
    "streetAddress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "telephoneNumber" TEXT,
    "telephoneNumberSecondary" TEXT,
    "faxNumber" TEXT,
    "email" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_contracts" (
    "id" TEXT NOT NULL,
    "contractNumber" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "contractDefinition" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "client_contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "telephoneNumber" TEXT NOT NULL,
    "telephoneNumberSecondary" TEXT,
    "email" TEXT NOT NULL,
    "role" "ContactRole" NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "ownerType" "ContactOwnerType" NOT NULL,
    "clientId" TEXT,
    "manufacturerId" TEXT,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devices" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "productionYear" INTEGER NOT NULL,
    "installationDate" TIMESTAMP(3) NOT NULL,
    "usesMainAddress" BOOLEAN NOT NULL DEFAULT true,
    "installationLocationAddress" TEXT,
    "installationLocationCity" TEXT,
    "clientId" TEXT,
    "modelId" TEXT,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "models" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "description" TEXT NOT NULL,
    "regulatoryStatus" "RegulatoryStatus" DEFAULT 'ACTIVE',
    "endOfSaleDate" TIMESTAMP(3),
    "endOfSupportDate" TIMESTAMP(3),
    "manufacturerId" TEXT,

    CONSTRAINT "models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spare_parts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "partNumber" TEXT,
    "price" DECIMAL(10,2),
    "isOem" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "minDeviceModelYear" INTEGER,
    "maxDeviceModelYear" INTEGER,
    "manufacturerId" TEXT,

    CONSTRAINT "spare_parts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spare_part_substitutions" (
    "id" TEXT NOT NULL,
    "originalPartId" TEXT NOT NULL,
    "substitutePartId" TEXT NOT NULL,
    "substitutionType" "SubstitutionType" NOT NULL,
    "description" TEXT,
    "expiryDate" TIMESTAMP(3),

    CONSTRAINT "spare_part_substitutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manufacturers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "description" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "manufacturers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_orders" (
    "id" TEXT NOT NULL,
    "caseNumber" TEXT NOT NULL,
    "autoIncrement" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "dateOpened" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "datePlanned" TIMESTAMP(3),
    "dateServiced" TIMESTAMP(3),
    "dateOfReport" TIMESTAMP(3),
    "dateOfCancelation" TIMESTAMP(3),
    "attendingContactId" TEXT,
    "status" "WorkOrderStatus" NOT NULL DEFAULT 'OPEN',
    "continuedFromId" TEXT,
    "clientId" TEXT NOT NULL,
    "contractId" TEXT,
    "acceptingDescription" TEXT NOT NULL,
    "serviceDescription" TEXT,
    "interventionDescription" TEXT,
    "notFinishedDescription" TEXT,
    "payWhen" "PaymentTerm" NOT NULL DEFAULT 'IMMEDIATE',
    "workOrderType" "WorkOrderType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdByUserId" TEXT,
    "acceptedByUserId" TEXT,
    "acceptedAt" TIMESTAMP(3),

    CONSTRAINT "work_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_order_service_assignments" (
    "id" TEXT NOT NULL,
    "workOrderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "WorkOrderServiceAssignmentRole" NOT NULL,
    "hoursOfTravel" DECIMAL(6,2) NOT NULL,
    "hoursOfWork" DECIMAL(6,2) NOT NULL,

    CONSTRAINT "work_order_service_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_order_devices" (
    "id" TEXT NOT NULL,
    "workOrderId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,

    CONSTRAINT "work_order_devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spare_part_in_cases" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "note" TEXT,
    "priceAtSale" DECIMAL(10,2),
    "workOrderDeviceId" TEXT NOT NULL,
    "sparePartId" TEXT NOT NULL,

    CONSTRAINT "spare_part_in_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificates" (
    "id" TEXT NOT NULL,
    "certificateNumber" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "department" TEXT,
    "address" TEXT NOT NULL,
    "workOrderId" TEXT NOT NULL,
    "issuedByUserId" TEXT NOT NULL,
    "controlledByUserId" TEXT,
    "conclusion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificate_devices" (
    "id" TEXT NOT NULL,
    "certificateId" TEXT NOT NULL,
    "deviceId" TEXT,
    "manufacturer" TEXT NOT NULL,
    "deviceType" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certificate_devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificate_checks" (
    "id" TEXT NOT NULL,
    "certificateDeviceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "result" BOOLEAN NOT NULL,
    "expectedValue" TEXT,
    "measuredValue" TEXT,

    CONSTRAINT "certificate_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DeviceModelToSparePart" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DeviceModelToSparePart_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_slug_key" ON "clients"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");

-- CreateIndex
CREATE INDEX "clients_name_idx" ON "clients"("name");

-- CreateIndex
CREATE UNIQUE INDEX "client_contracts_clientId_contractNumber_key" ON "client_contracts"("clientId", "contractNumber");

-- CreateIndex
CREATE INDEX "contacts_ownerType_clientId_idx" ON "contacts"("ownerType", "clientId");

-- CreateIndex
CREATE INDEX "contacts_ownerType_manufacturerId_idx" ON "contacts"("ownerType", "manufacturerId");

-- CreateIndex
CREATE UNIQUE INDEX "devices_slug_key" ON "devices"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "devices_serialNumber_key" ON "devices"("serialNumber");

-- CreateIndex
CREATE INDEX "devices_serialNumber_idx" ON "devices"("serialNumber");

-- CreateIndex
CREATE INDEX "devices_clientId_idx" ON "devices"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "models_name_key" ON "models"("name");

-- CreateIndex
CREATE UNIQUE INDEX "models_slug_key" ON "models"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "spare_parts_slug_key" ON "spare_parts"("slug");

-- CreateIndex
CREATE INDEX "spare_parts_manufacturerId_idx" ON "spare_parts"("manufacturerId");

-- CreateIndex
CREATE INDEX "spare_part_substitutions_originalPartId_idx" ON "spare_part_substitutions"("originalPartId");

-- CreateIndex
CREATE INDEX "spare_part_substitutions_substitutePartId_idx" ON "spare_part_substitutions"("substitutePartId");

-- CreateIndex
CREATE UNIQUE INDEX "spare_part_substitutions_originalPartId_substitutePartId_key" ON "spare_part_substitutions"("originalPartId", "substitutePartId");

-- CreateIndex
CREATE UNIQUE INDEX "manufacturers_name_key" ON "manufacturers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "manufacturers_slug_key" ON "manufacturers"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "work_orders_caseNumber_key" ON "work_orders"("caseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "work_orders_autoIncrement_key" ON "work_orders"("autoIncrement");

-- CreateIndex
CREATE UNIQUE INDEX "work_orders_slug_key" ON "work_orders"("slug");

-- CreateIndex
CREATE INDEX "work_orders_status_clientId_idx" ON "work_orders"("status", "clientId");

-- CreateIndex
CREATE INDEX "work_orders_clientId_dateOpened_idx" ON "work_orders"("clientId", "dateOpened");

-- CreateIndex
CREATE INDEX "work_orders_status_dateOpened_idx" ON "work_orders"("status", "dateOpened");

-- CreateIndex
CREATE INDEX "work_orders_dateOpened_idx" ON "work_orders"("dateOpened");

-- CreateIndex
CREATE INDEX "work_order_service_assignments_workOrderId_role_idx" ON "work_order_service_assignments"("workOrderId", "role");

-- CreateIndex
CREATE INDEX "work_order_service_assignments_userId_idx" ON "work_order_service_assignments"("userId");

-- CreateIndex
CREATE INDEX "work_order_service_assignments_workOrderId_idx" ON "work_order_service_assignments"("workOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "work_order_service_assignments_workOrderId_userId_key" ON "work_order_service_assignments"("workOrderId", "userId");

-- CreateIndex
CREATE INDEX "work_order_devices_workOrderId_idx" ON "work_order_devices"("workOrderId");

-- CreateIndex
CREATE INDEX "work_order_devices_deviceId_idx" ON "work_order_devices"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "work_order_devices_workOrderId_deviceId_key" ON "work_order_devices"("workOrderId", "deviceId");

-- CreateIndex
CREATE INDEX "spare_part_in_cases_workOrderDeviceId_idx" ON "spare_part_in_cases"("workOrderDeviceId");

-- CreateIndex
CREATE INDEX "spare_part_in_cases_sparePartId_idx" ON "spare_part_in_cases"("sparePartId");

-- CreateIndex
CREATE INDEX "spare_part_in_cases_sparePartId_workOrderDeviceId_idx" ON "spare_part_in_cases"("sparePartId", "workOrderDeviceId");

-- CreateIndex
CREATE UNIQUE INDEX "certificates_certificateNumber_key" ON "certificates"("certificateNumber");

-- CreateIndex
CREATE INDEX "_DeviceModelToSparePart_B_index" ON "_DeviceModelToSparePart"("B");

-- AddForeignKey
ALTER TABLE "workflow" ADD CONSTRAINT "workflow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_contracts" ADD CONSTRAINT "client_contracts_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "manufacturers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "models"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "models" ADD CONSTRAINT "models_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "manufacturers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spare_parts" ADD CONSTRAINT "spare_parts_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "manufacturers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spare_part_substitutions" ADD CONSTRAINT "spare_part_substitutions_originalPartId_fkey" FOREIGN KEY ("originalPartId") REFERENCES "spare_parts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spare_part_substitutions" ADD CONSTRAINT "spare_part_substitutions_substitutePartId_fkey" FOREIGN KEY ("substitutePartId") REFERENCES "spare_parts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_attendingContactId_fkey" FOREIGN KEY ("attendingContactId") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_continuedFromId_fkey" FOREIGN KEY ("continuedFromId") REFERENCES "work_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "client_contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_acceptedByUserId_fkey" FOREIGN KEY ("acceptedByUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_order_service_assignments" ADD CONSTRAINT "work_order_service_assignments_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "work_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_order_service_assignments" ADD CONSTRAINT "work_order_service_assignments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_order_devices" ADD CONSTRAINT "work_order_devices_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "work_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_order_devices" ADD CONSTRAINT "work_order_devices_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spare_part_in_cases" ADD CONSTRAINT "spare_part_in_cases_workOrderDeviceId_fkey" FOREIGN KEY ("workOrderDeviceId") REFERENCES "work_order_devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spare_part_in_cases" ADD CONSTRAINT "spare_part_in_cases_sparePartId_fkey" FOREIGN KEY ("sparePartId") REFERENCES "spare_parts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "work_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_issuedByUserId_fkey" FOREIGN KEY ("issuedByUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_controlledByUserId_fkey" FOREIGN KEY ("controlledByUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificate_devices" ADD CONSTRAINT "certificate_devices_certificateId_fkey" FOREIGN KEY ("certificateId") REFERENCES "certificates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificate_devices" ADD CONSTRAINT "certificate_devices_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificate_checks" ADD CONSTRAINT "certificate_checks_certificateDeviceId_fkey" FOREIGN KEY ("certificateDeviceId") REFERENCES "certificate_devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeviceModelToSparePart" ADD CONSTRAINT "_DeviceModelToSparePart_A_fkey" FOREIGN KEY ("A") REFERENCES "models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeviceModelToSparePart" ADD CONSTRAINT "_DeviceModelToSparePart_B_fkey" FOREIGN KEY ("B") REFERENCES "spare_parts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
