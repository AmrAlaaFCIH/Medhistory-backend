/*
  Warnings:

  - You are about to drop the column `Adm_Name` on the `Admins` table. All the data in the column will be lost.
  - Added the required column `Adm_First_Name` to the `Admins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Adm_Last_Name` to the `Admins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Adm_Password` to the `Admins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Doc_Password` to the `Doctors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `P_Password` to the `Patients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Admins` DROP COLUMN `Adm_Name`,
    ADD COLUMN `Adm_First_Name` VARCHAR(191) NOT NULL,
    ADD COLUMN `Adm_Last_Name` VARCHAR(191) NOT NULL,
    ADD COLUMN `Adm_Password` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Doctors` ADD COLUMN `Doc_Password` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Patients` ADD COLUMN `P_Password` VARCHAR(191) NOT NULL;
