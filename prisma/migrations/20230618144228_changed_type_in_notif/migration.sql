/*
  Warnings:

  - You are about to alter the column `Status` on the `Notfications` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `Notfications` MODIFY `Status` BOOLEAN NOT NULL DEFAULT false;
