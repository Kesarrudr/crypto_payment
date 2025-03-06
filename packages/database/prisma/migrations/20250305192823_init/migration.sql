/*
  Warnings:

  - Added the required column `Status` to the `MerchantTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TxStatus" AS ENUM ('failed', 'success');

-- AlterTable
ALTER TABLE "MerchantTransaction" ADD COLUMN     "Status" "TxStatus" NOT NULL;
