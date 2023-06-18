-- CreateTable
CREATE TABLE `Patients` (
    `P_ID` VARCHAR(191) NOT NULL,
    `P_First_Name` VARCHAR(191) NOT NULL,
    `P_Last_Name` VARCHAR(191) NOT NULL,
    `P_Marital_Status` VARCHAR(191) NOT NULL,
    `P_Email` VARCHAR(191) NOT NULL,
    `P_Address` VARCHAR(191) NOT NULL,
    `P_DOB` DATETIME(3) NOT NULL,
    `P_Emergency_Contact` VARCHAR(191) NOT NULL,
    `P_Habits` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`P_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Patient_Phone` (
    `P_phone` VARCHAR(191) NOT NULL,
    `P_ID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`P_phone`, `P_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Doctors` (
    `Doc_ID` VARCHAR(191) NOT NULL,
    `Doc_First_Name` VARCHAR(191) NOT NULL,
    `Doc_Last_Name` VARCHAR(191) NOT NULL,
    `Doc_Email` VARCHAR(191) NOT NULL,
    `Doc_Address` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`Doc_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Doctor_Phone` (
    `Doc_Phone` VARCHAR(191) NOT NULL,
    `Doc_ID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`Doc_Phone`, `Doc_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notfications` (
    `Not_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `P_ID` VARCHAR(191) NOT NULL,
    `Doc_ID` VARCHAR(191) NOT NULL,
    `Status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`Not_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admins` (
    `Adm_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Adm_Name` VARCHAR(191) NOT NULL,
    `Adm_Email` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`Adm_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `medical` (
    `Med_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `P_ID` VARCHAR(191) NOT NULL,
    `Prescription` LONGBLOB NOT NULL,
    `Follow_Up` DATETIME(3) NOT NULL,
    `Measurments` LONGBLOB NOT NULL,
    `x_ray` LONGBLOB NOT NULL,
    `Scans` LONGBLOB NOT NULL,
    `Medicines_Date` DATETIME(3) NOT NULL,
    `Medicines_Dose` INTEGER NOT NULL,

    PRIMARY KEY (`Med_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_doctor_patient` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_doctor_patient_AB_unique`(`A`, `B`),
    INDEX `_doctor_patient_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Patient_Phone` ADD CONSTRAINT `Patient_Phone_P_ID_fkey` FOREIGN KEY (`P_ID`) REFERENCES `Patients`(`P_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Doctor_Phone` ADD CONSTRAINT `Doctor_Phone_Doc_ID_fkey` FOREIGN KEY (`Doc_ID`) REFERENCES `Doctors`(`Doc_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notfications` ADD CONSTRAINT `Notfications_P_ID_fkey` FOREIGN KEY (`P_ID`) REFERENCES `Patients`(`P_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notfications` ADD CONSTRAINT `Notfications_Doc_ID_fkey` FOREIGN KEY (`Doc_ID`) REFERENCES `Doctors`(`Doc_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `medical` ADD CONSTRAINT `medical_P_ID_fkey` FOREIGN KEY (`P_ID`) REFERENCES `Patients`(`P_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_doctor_patient` ADD CONSTRAINT `_doctor_patient_A_fkey` FOREIGN KEY (`A`) REFERENCES `Doctors`(`Doc_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_doctor_patient` ADD CONSTRAINT `_doctor_patient_B_fkey` FOREIGN KEY (`B`) REFERENCES `Patients`(`P_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
