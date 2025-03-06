/*
  Warnings:

  - You are about to drop the column `stableTokenMint` on the `AssociatedTokenAccount` table. All the data in the column will be lost.
  - You are about to drop the `StableToken` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[merchantUserName]` on the table `AssociatedTokenAccount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tokenAddress,merchantUserName]` on the table `AssociatedTokenAccount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tokenAddress` to the `AssociatedTokenAccount` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AssociatedTokenAccount" DROP CONSTRAINT "AssociatedTokenAccount_stableTokenMint_fkey";

-- DropIndex
DROP INDEX "AssociatedTokenAccount_stableTokenMint_merchantUserName_key";

-- AlterTable
ALTER TABLE "AssociatedTokenAccount" DROP COLUMN "stableTokenMint",
ADD COLUMN     "tokenAddress" TEXT NOT NULL;

-- DropTable
DROP TABLE "StableToken";

-- CreateIndex
CREATE UNIQUE INDEX "AssociatedTokenAccount_merchantUserName_key" ON "AssociatedTokenAccount"("merchantUserName");

-- CreateIndex
CREATE INDEX "AssociatedTokenAccount_merchantUserName_accountAddress_idx" ON "AssociatedTokenAccount"("merchantUserName", "accountAddress");

-- CreateIndex
CREATE UNIQUE INDEX "AssociatedTokenAccount_tokenAddress_merchantUserName_key" ON "AssociatedTokenAccount"("tokenAddress", "merchantUserName");
