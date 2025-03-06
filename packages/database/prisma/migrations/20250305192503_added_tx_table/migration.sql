-- CreateTable
CREATE TABLE "MerchantTransaction" (
    "id" TEXT NOT NULL,
    "tokenAmount" BIGINT NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "Date" TEXT NOT NULL,
    "payerAddress" TEXT NOT NULL,
    "Time" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "merchantUserName" TEXT NOT NULL,
    "USDTAmount" INTEGER NOT NULL,
    "SwapRate" INTEGER NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MerchantTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MerchantTransaction_signature_key" ON "MerchantTransaction"("signature");

-- CreateIndex
CREATE INDEX "MerchantTransaction_signature_merchantUserName_tokenAddress_idx" ON "MerchantTransaction"("signature", "merchantUserName", "tokenAddress");

-- AddForeignKey
ALTER TABLE "MerchantTransaction" ADD CONSTRAINT "MerchantTransaction_tokenAddress_fkey" FOREIGN KEY ("tokenAddress") REFERENCES "SwapableTokens"("tokenAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantTransaction" ADD CONSTRAINT "MerchantTransaction_merchantUserName_fkey" FOREIGN KEY ("merchantUserName") REFERENCES "Merchant"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
