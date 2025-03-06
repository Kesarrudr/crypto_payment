-- CreateTable
CREATE TABLE "Merchant" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "mnemonic" VARCHAR(512) NOT NULL,
    "publicKey" TEXT NOT NULL,
    "privateKey" VARCHAR(512) NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Merchant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StableToken" (
    "id" TEXT NOT NULL,
    "mint" TEXT NOT NULL,

    CONSTRAINT "StableToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssociatedTokenAccount" (
    "id" TEXT NOT NULL,
    "accountAddress" TEXT NOT NULL,
    "stableTokenMint" TEXT NOT NULL,
    "merchantUserName" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssociatedTokenAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SwapableTokens" (
    "id" TEXT NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symobol" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL,
    "logoURL" TEXT NOT NULL,
    "tags" TEXT[],
    "tokenCreatedAt" TEXT NOT NULL,
    "freeze_authority" TEXT NOT NULL,
    "mint_authority" TEXT NOT NULL,
    "tokenOwner" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SwapableTokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_username_key" ON "Merchant"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_publicKey_key" ON "Merchant"("publicKey");

-- CreateIndex
CREATE INDEX "Merchant_username_idx" ON "Merchant"("username");

-- CreateIndex
CREATE UNIQUE INDEX "StableToken_mint_key" ON "StableToken"("mint");

-- CreateIndex
CREATE UNIQUE INDEX "AssociatedTokenAccount_accountAddress_key" ON "AssociatedTokenAccount"("accountAddress");

-- CreateIndex
CREATE UNIQUE INDEX "AssociatedTokenAccount_stableTokenMint_merchantUserName_key" ON "AssociatedTokenAccount"("stableTokenMint", "merchantUserName");

-- CreateIndex
CREATE UNIQUE INDEX "SwapableTokens_tokenAddress_key" ON "SwapableTokens"("tokenAddress");

-- CreateIndex
CREATE INDEX "SwapableTokens_tokenAddress_name_symobol_idx" ON "SwapableTokens"("tokenAddress", "name", "symobol");

-- AddForeignKey
ALTER TABLE "AssociatedTokenAccount" ADD CONSTRAINT "AssociatedTokenAccount_stableTokenMint_fkey" FOREIGN KEY ("stableTokenMint") REFERENCES "StableToken"("mint") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssociatedTokenAccount" ADD CONSTRAINT "AssociatedTokenAccount_merchantUserName_fkey" FOREIGN KEY ("merchantUserName") REFERENCES "Merchant"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
