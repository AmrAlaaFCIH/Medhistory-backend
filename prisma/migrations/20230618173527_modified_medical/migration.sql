/*
  Warnings:

  - You are about to drop the column `P_Habits` on the `Patients` table. All the data in the column will be lost.
  - You are about to drop the column `Measurments` on the `medical` table. All the data in the column will be lost.
  - You are about to drop the column `Prescription` on the `medical` table. All the data in the column will be lost.
  - You are about to drop the column `Scans` on the `medical` table. All the data in the column will be lost.
  - Added the required column `Doc_Card_Number` to the `Doctors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Doc_Speciality` to the `Doctors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `P_Blood_Type` to the `Patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `P_Gender` to the `Patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `MedicineName` to the `medical` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Doctors` ADD COLUMN `Doc_Card_Number` VARCHAR(191) NOT NULL,
    ADD COLUMN `Doc_Speciality` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Patients` DROP COLUMN `P_Habits`,
    ADD COLUMN `P_Blood_Type` VARCHAR(191) NOT NULL,
    ADD COLUMN `P_Gender` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `medical` DROP COLUMN `Measurments`,
    DROP COLUMN `Prescription`,
    DROP COLUMN `Scans`,
    ADD COLUMN `Medical_Analysis` LONGBLOB NULL,
    ADD COLUMN `MedicineName` VARCHAR(191) NOT NULL,
    MODIFY `x_ray` LONGBLOB NULL;
