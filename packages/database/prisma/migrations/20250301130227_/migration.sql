-- CreateTable
CREATE TABLE `Merchant` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `mnemonic` VARCHAR(191) NOT NULL,
    `publicKey` VARCHAR(191) NOT NULL,
    `privateKey` VARCHAR(191) NOT NULL,
    `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Merchant_username_key`(`username`),
    UNIQUE INDEX `Merchant_publicKey_key`(`publicKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StableToken` (
    `id` VARCHAR(191) NOT NULL,
    `mint` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `StableToken_mint_key`(`mint`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AssociatedTokenAccount` (
    `id` VARCHAR(191) NOT NULL,
    `accountAddress` VARCHAR(191) NOT NULL,
    `stableTokenMint` VARCHAR(191) NOT NULL,
    `merchantUserName` VARCHAR(191) NOT NULL,
    `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `AssociatedTokenAccount_accountAddress_key`(`accountAddress`),
    UNIQUE INDEX `AssociatedTokenAccount_stableTokenMint_merchantUserName_key`(`stableTokenMint`, `merchantUserName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AssociatedTokenAccount` ADD CONSTRAINT `AssociatedTokenAccount_stableTokenMint_fkey` FOREIGN KEY (`stableTokenMint`) REFERENCES `StableToken`(`mint`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssociatedTokenAccount` ADD CONSTRAINT `AssociatedTokenAccount_merchantUserName_fkey` FOREIGN KEY (`merchantUserName`) REFERENCES `Merchant`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;
