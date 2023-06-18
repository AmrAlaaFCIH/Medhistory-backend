/*
  Warnings:

  - You are about to drop the column `P_Emergency_Contact` on the `Patients` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[Doc_Email]` on the table `Doctors` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `P_Number_Relatives` to the `Patients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Patients` DROP COLUMN `P_Emergency_Contact`,
    ADD COLUMN `P_Number_Relatives` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Doctors_Doc_Email_key` ON `Doctors`(`Doc_Email`);
