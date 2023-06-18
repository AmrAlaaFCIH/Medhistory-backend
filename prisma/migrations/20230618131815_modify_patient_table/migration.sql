/*
  Warnings:

  - You are about to drop the column `P_Number_Relatives` on the `Patients` table. All the data in the column will be lost.
  - Added the required column `P_Phone_Number_Relative` to the `Patients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Patients` DROP COLUMN `P_Number_Relatives`,
    ADD COLUMN `P_Phone_Number_Relative` VARCHAR(191) NOT NULL;
