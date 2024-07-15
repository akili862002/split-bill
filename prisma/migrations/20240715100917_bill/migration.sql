/*
  Warnings:

  - Added the required column `isPayer` to the `BillMember` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BillMember" ADD COLUMN     "isPayer" BOOLEAN NOT NULL;
