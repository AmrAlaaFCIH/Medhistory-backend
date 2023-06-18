/*
  Warnings:

  - The primary key for the `Notfications` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `Notfications` DROP PRIMARY KEY,
    MODIFY `Not_ID` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`Not_ID`);
