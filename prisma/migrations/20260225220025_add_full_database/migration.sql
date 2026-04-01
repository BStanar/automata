/*
  Warnings:

  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `user` table without a default value. This is not possible if the table is not empty.

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

-- AlterTableALTER TABLE "user" DROP COLUMN "name";
ALTER TABLE "user" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'SERVICE_PERSON';
ALTER TABLE "user" ADD COLUMN "firstName" TEXT NOT NULL DEFAULT '';
ALTER TABLE "user" ADD COLUMN "lastName" TEXT NOT NULL DEFAULT '';
ALTER TABLE "user" ALTER COLUMN "firstName" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "lastName" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "registrationNumber" TEXT,
    "vatNumber" TEXT,
    "streetAddress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "telephoneNumber" TEXT,
    "telephoneNumberSecondary" TEXT,
    "faxNumber" TEXT,
    "email" TEXT NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientContract" (
    "id" TEXT NOT NULL,
    "contractNumber" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "contractDefinition" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "ClientContract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "telephoneNumber" TEXT NOT NULL,
    "telephoneNumberSecondary" TEXT,
    "email" TEXT NOT NULL,
    "role" "ContactRole" NOT NULL,
    "ownerType" "ContactOwnerType" NOT NULL,
    "clientId" TEXT,
    "manufacturerId" TEXT,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "productionYear" INTEGER NOT NULL,
    "installationDate" TIMESTAMP(3) NOT NULL,
    "installationLocation" TEXT NOT NULL,
    "clientId" TEXT,
    "modelId" TEXT,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "regulatoryStatus" "RegulatoryStatus",
    "endOfSaleDate" TIMESTAMP(3),
    "endOfSupportDate" TIMESTAMP(3),
    "manufacturerId" TEXT,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SparePart" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "serialNumber" TEXT,
    "price" DECIMAL(10,2),
    "isOem" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "minModelYear" INTEGER,
    "maxModelYear" INTEGER,
    "manufacturerId" TEXT,

    CONSTRAINT "SparePart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SparePartSubstitution" (
    "id" TEXT NOT NULL,
    "originalPartId" TEXT NOT NULL,
    "substitutePartId" TEXT NOT NULL,
    "substitutionType" "SubstitutionType" NOT NULL,
    "description" TEXT,
    "expiryDate" TIMESTAMP(3),

    CONSTRAINT "SparePartSubstitution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manufacturer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Manufacturer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_orders" (
    "id" TEXT NOT NULL,
    "caseNumber" TEXT NOT NULL,
    "autoIncrement" SERIAL NOT NULL,
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
    "acceptingDescription" TEXT,
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
CREATE TABLE "WorkOrderServiceAssignment" (
    "id" TEXT NOT NULL,
    "workOrderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "WorkOrderServiceAssignmentRole" NOT NULL,
    "hoursOfTravel" INTEGER NOT NULL,
    "hoursOfWork" INTEGER NOT NULL,

    CONSTRAINT "WorkOrderServiceAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_order_devices" (
    "id" TEXT NOT NULL,
    "workOrderId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "findings" TEXT,
    "recommendations" TEXT,

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
CREATE TABLE "Certificate" (
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

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CertificateDevice" (
    "id" TEXT NOT NULL,
    "certificateId" TEXT NOT NULL,
    "deviceId" TEXT,
    "manufacturer" TEXT NOT NULL,
    "deviceType" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CertificateDevice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CertificateCheck" (
    "id" TEXT NOT NULL,
    "certificateDeviceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "result" BOOLEAN NOT NULL,
    "expectedValue" TEXT,
    "measuredValue" TEXT,

    CONSTRAINT "CertificateCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ModelToSparePart" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ModelToSparePart_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- CreateIndex
CREATE INDEX "Client_name_idx" ON "Client"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ClientContract_clientId_contractNumber_key" ON "ClientContract"("clientId", "contractNumber");

-- CreateIndex
CREATE INDEX "Contact_ownerType_clientId_idx" ON "Contact"("ownerType", "clientId");

-- CreateIndex
CREATE INDEX "Contact_ownerType_manufacturerId_idx" ON "Contact"("ownerType", "manufacturerId");

-- CreateIndex
CREATE UNIQUE INDEX "Device_serialNumber_key" ON "Device"("serialNumber");

-- CreateIndex
CREATE INDEX "Device_serialNumber_idx" ON "Device"("serialNumber");

-- CreateIndex
CREATE INDEX "Device_clientId_idx" ON "Device"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "Model_name_key" ON "Model"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SparePart_serialNumber_key" ON "SparePart"("serialNumber");

-- CreateIndex
CREATE INDEX "SparePart_manufacturerId_idx" ON "SparePart"("manufacturerId");

-- CreateIndex
CREATE INDEX "SparePartSubstitution_originalPartId_idx" ON "SparePartSubstitution"("originalPartId");

-- CreateIndex
CREATE INDEX "SparePartSubstitution_substitutePartId_idx" ON "SparePartSubstitution"("substitutePartId");

-- CreateIndex
CREATE UNIQUE INDEX "SparePartSubstitution_originalPartId_substitutePartId_key" ON "SparePartSubstitution"("originalPartId", "substitutePartId");

-- CreateIndex
CREATE UNIQUE INDEX "Manufacturer_name_key" ON "Manufacturer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "work_orders_caseNumber_key" ON "work_orders"("caseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "work_orders_autoIncrement_key" ON "work_orders"("autoIncrement");

-- CreateIndex
CREATE INDEX "work_orders_status_clientId_idx" ON "work_orders"("status", "clientId");

-- CreateIndex
CREATE INDEX "work_orders_clientId_dateOpened_idx" ON "work_orders"("clientId", "dateOpened");

-- CreateIndex
CREATE INDEX "work_orders_status_dateOpened_idx" ON "work_orders"("status", "dateOpened");

-- CreateIndex
CREATE INDEX "work_orders_dateOpened_idx" ON "work_orders"("dateOpened");

-- CreateIndex
CREATE INDEX "WorkOrderServiceAssignment_workOrderId_role_idx" ON "WorkOrderServiceAssignment"("workOrderId", "role");

-- CreateIndex
CREATE INDEX "WorkOrderServiceAssignment_userId_idx" ON "WorkOrderServiceAssignment"("userId");

-- CreateIndex
CREATE INDEX "WorkOrderServiceAssignment_workOrderId_idx" ON "WorkOrderServiceAssignment"("workOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkOrderServiceAssignment_workOrderId_userId_key" ON "WorkOrderServiceAssignment"("workOrderId", "userId");

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
CREATE UNIQUE INDEX "Certificate_certificateNumber_key" ON "Certificate"("certificateNumber");

-- CreateIndex
CREATE INDEX "_ModelToSparePart_B_index" ON "_ModelToSparePart"("B");

-- AddForeignKey
ALTER TABLE "ClientContract" ADD CONSTRAINT "ClientContract_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SparePart" ADD CONSTRAINT "SparePart_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SparePartSubstitution" ADD CONSTRAINT "SparePartSubstitution_originalPartId_fkey" FOREIGN KEY ("originalPartId") REFERENCES "SparePart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SparePartSubstitution" ADD CONSTRAINT "SparePartSubstitution_substitutePartId_fkey" FOREIGN KEY ("substitutePartId") REFERENCES "SparePart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_attendingContactId_fkey" FOREIGN KEY ("attendingContactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_continuedFromId_fkey" FOREIGN KEY ("continuedFromId") REFERENCES "work_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "ClientContract"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_acceptedByUserId_fkey" FOREIGN KEY ("acceptedByUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkOrderServiceAssignment" ADD CONSTRAINT "WorkOrderServiceAssignment_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "work_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkOrderServiceAssignment" ADD CONSTRAINT "WorkOrderServiceAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_order_devices" ADD CONSTRAINT "work_order_devices_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "work_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_order_devices" ADD CONSTRAINT "work_order_devices_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spare_part_in_cases" ADD CONSTRAINT "spare_part_in_cases_workOrderDeviceId_fkey" FOREIGN KEY ("workOrderDeviceId") REFERENCES "work_order_devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spare_part_in_cases" ADD CONSTRAINT "spare_part_in_cases_sparePartId_fkey" FOREIGN KEY ("sparePartId") REFERENCES "SparePart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "work_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_issuedByUserId_fkey" FOREIGN KEY ("issuedByUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_controlledByUserId_fkey" FOREIGN KEY ("controlledByUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificateDevice" ADD CONSTRAINT "CertificateDevice_certificateId_fkey" FOREIGN KEY ("certificateId") REFERENCES "Certificate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificateDevice" ADD CONSTRAINT "CertificateDevice_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificateCheck" ADD CONSTRAINT "CertificateCheck_certificateDeviceId_fkey" FOREIGN KEY ("certificateDeviceId") REFERENCES "CertificateDevice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModelToSparePart" ADD CONSTRAINT "_ModelToSparePart_A_fkey" FOREIGN KEY ("A") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModelToSparePart" ADD CONSTRAINT "_ModelToSparePart_B_fkey" FOREIGN KEY ("B") REFERENCES "SparePart"("id") ON DELETE CASCADE ON UPDATE CASCADE;
