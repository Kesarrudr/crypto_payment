/*
  Warnings:

  - You are about to drop the column `symobol` on the `SwapableTokens` table. All the data in the column will be lost.
  - Added the required column `symbol` to the `SwapableTokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "SwapableTokens_tokenAddress_name_symobol_idx";

-- AlterTable
ALTER TABLE "SwapableTokens" DROP COLUMN "symobol",
ADD COLUMN     "symbol" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "SwapableTokens_tokenAddress_name_symbol_idx" ON "SwapableTokens"("tokenAddress", "name", "symbol");
