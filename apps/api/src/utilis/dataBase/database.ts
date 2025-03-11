import { Prisma, prisma } from "@repo/database";
import { Account } from "@solana/spl-token";
import { AppError } from "../funtions/AppError.js";
import { getWalletDetails, WalletData } from "../funtions/generate_wallet.js";
import { getHashPassword, StatusCode } from "../funtions/helperFunctions.js";
import { RegisterMerchantType, TransactionType } from "../funtions/zod.js";
import { USDC_TOKEN_ADDRESS } from "../Constants/index.js";

const registerMerchant = async ({
  username,
  password,
}: RegisterMerchantType) => {
  try {
    //TODO: encrypt the password before storing and do better key managment

    const { nemonic, primaryWallet }: WalletData = await getWalletDetails();
    const hashpassword = await getHashPassword(password);

    const newUser = await prisma.merchant.create({
      data: {
        username: username,
        password: hashpassword,
        mnemonic: nemonic,
        publicKey: primaryWallet.primary_publicKey,
        privateKey: primaryWallet.primary_privateKey,
      },
      select: {
        username: true,
        mnemonic: true,
        publicKey: true,
      },
    });

    return newUser;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        throw new AppError(
          `User already exits with ${username} username. try some other username`,
          StatusCode.BAD_REQUEST,
        );
      }
    }
    throw new AppError(
      "DataBase not working",
      StatusCode.SERVICE_UNAVAILABLE,
      false,
    );
  }
};

const getMerchantDetails = async (useName: string) => {
  try {
    const user = await prisma.merchant.findUniqueOrThrow({
      where: {
        username: useName,
      },
      select: {
        id: true,
        username: true,
        publicKey: true,
        password: true,
      },
    });
    return user;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        throw new AppError(
          `No user exits with ${useName} username`,
          StatusCode.BAD_REQUEST,
        );
      }
    }
    throw new AppError(
      "DataBase not working",
      StatusCode.SERVICE_UNAVAILABLE,
      false,
    );
  }
};

const associatedTokenAccountDetails = async (
  username: string,
  publickey: string,
) => {
  try {
    const account = await prisma.associatedTokenAccount.findUnique({
      where: {
        merchantUserName: username,
        merchant: {
          publicKey: publickey,
        },
      },
      select: {
        accountAddress: true,
        tokenAddress: true,
      },
    });

    return account;
  } catch (error) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new AppError(
          `Can't find account address of ${publickey} public key for this ${USDC_TOKEN_ADDRESS} mint`,
          StatusCode.BAD_REQUEST,
        );
      }
    }
    throw new AppError(
      "Data Base call issuse",
      StatusCode.INTERNAL_SERVER_ERROR,
      false,
    );
  }
};

const merchantKeysDetails = async (publicKey: string, username: string) => {
  try {
    const keyDetails = await prisma.merchant.findUniqueOrThrow({
      where: {
        username: username,
        publicKey: publicKey,
      },
      select: {
        privateKey: true,
        username: true,
        publicKey: true,
      },
    });
    return keyDetails;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new AppError(
          `Can't find a mechant with ${username} name having wallet ${publicKey} address`,
          StatusCode.BAD_REQUEST,
        );
      }
      throw new AppError(
        "Some Prisma Error",
        StatusCode.INTERNAL_SERVER_ERROR,
        false,
      );
    }
    throw new AppError(
      "DATA BASE ERROR",
      StatusCode.SERVICE_UNAVAILABLE,
      false,
    );
  }
};

const storeAssociatedAccount = async (
  username: string,
  publicKey: string,
  accountDetails: Account,
) => {
  try {
    return await prisma.associatedTokenAccount.upsert({
      where: {
        merchantUserName: username,
        merchant: {
          publicKey: publicKey,
        },
      },
      create: {
        accountAddress: accountDetails.address.toBase58(),
        tokenAddress: accountDetails.mint.toBase58(),
        merchantUserName: username,
      },
      update: {
        accountAddress: accountDetails.address.toBase58(),
      },
      select: {
        accountAddress: true,
        tokenAddress: true,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new AppError(
        `Error while creating, updating the token account of ${username} user for ${accountDetails.mint.toBase58()} mint`,
        StatusCode.BAD_REQUEST,
      );
    } else {
      console.log("Error in storeAssociatedAccount:", error);
      throw new AppError("Error", StatusCode.SERVICE_UNAVAILABLE, false);
    }
  }
};

const merchantUserName = async (username: string) => {
  try {
    //TODO: make this query faster
    const merchantUsername = await prisma.merchant.findMany({
      where: {
        username: {
          startsWith: username,
          mode: "insensitive",
        },
      },
      select: {
        username: true,
        publicKey: true,
        AssociatedTokenAccount: {
          select: {
            accountAddress: true,
          },
        },
      },
      take: 20,
    });

    return merchantUsername;
  } catch (error) {
    throw new AppError(
      "Error while Getting merchant ",
      StatusCode.INTERNAL_SERVER_ERROR,
      false,
    );
  }
};

const tokenDeatils = async (token: string) => {
  try {
    //TODO: make this query faster
    const details = await prisma.swapableTokens.findMany({
      where: {
        OR: [
          {
            name: {
              startsWith: token,
              mode: "insensitive",
            },
          },
          {
            symbol: {
              startsWith: token,
              mode: "insensitive",
            },
          },
          {
            tokenAddress: {
              startsWith: token,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        tokenAddress: true,
        name: true,
        decimals: true,
        logoURL: true,
        tags: true,
        symbol: true,
      },
      take: 20,
    });

    return details;
  } catch (error) {
    console.log("error", error);
    throw new AppError(
      "Error while getting the token list",
      StatusCode.INTERNAL_SERVER_ERROR,
      false,
    );
  }
};

const merchantIDSearch = async (id: string, publicKey: string) => {
  try {
    const merchant = await prisma.merchant.findUnique({
      where: {
        id,
        publicKey,
      },
      select: {
        username: true,
        publicKey: true,
      },
    });

    if (!merchant) {
      throw new AppError("Can't find this Merchant", StatusCode.BAD_REQUEST);
    }

    return merchant;
  } catch (error) {
    console.log("Error", error);
    throw new AppError(
      "Merchant ID Search Error",
      StatusCode.INTERNAL_SERVER_ERROR,
      false,
    );
  }
};

const getMerchantTx = async (
  username: string,
  publicKey: string,
  skip: number,
) => {
  try {
    const tx = await prisma.merchant.findFirst({
      where: {
        username,
        publicKey,
      },
      select: {
        MerchantTransaction: {
          select: {
            tokenAmount: true,
            payerAddress: true,
            Date: true,
            Time: true,
            signature: true,
            USDTAmount: true,
            SwapRate: true,
            Status: true,
            token: {
              select: {
                name: true,
                symbol: true,
                logoURL: true,
                tokenAddress: true,
                decimals: true,
              },
            },
          },
          skip: skip * 20,
          take: 20,
          orderBy: {
            Date: "desc",
          },
        },
        _count: true,
      },
    });

    return tx;
  } catch (error) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new AppError("Can't get the tx details", StatusCode.BAD_REQUEST);
    }
    throw new AppError(
      "Error getting merchant tx Details",
      StatusCode.SERVICE_UNAVAILABLE,
      false,
    );
  }
};

const getBalance = async (username: string, publicKey: string) => {
  try {
    const balance = await prisma.merchant.findUnique({
      where: {
        username,
        publicKey,
      },
      select: {
        Balance: true,
      },
    });

    return balance;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new AppError("Can't get the balance", StatusCode.BAD_REQUEST);
    }
    throw new AppError(
      "Error fetching the balance",
      StatusCode.SERVICE_UNAVAILABLE,
      false,
    );
  }
};

const transactionSave = async (txData: TransactionType, rate: number) => {
  try {
    await prisma.merchantTransaction.create({
      data: {
        tokenAmount: BigInt(txData.tokenAmount),
        tokenAddress: txData.tokenAddress,
        Date: txData.date,
        Time: txData.time,
        signature: txData.signature,
        USDTAmount: Number(txData.USDCAmount),
        payerAddress: txData.payerAddress,
        merchantUserName: txData.merchantUserName,
        Status: txData.Status,
        SwapRate: rate,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new AppError("Can't save the tx", StatusCode.BAD_REQUEST);
    }
    throw new AppError(
      "Error saving tx",
      StatusCode.SERVICE_UNAVAILABLE,
      false,
    );
  }
};

export {
  transactionSave,
  getBalance,
  getMerchantTx,
  tokenDeatils,
  merchantIDSearch,
  merchantUserName,
  associatedTokenAccountDetails,
  getMerchantDetails,
  merchantKeysDetails,
  registerMerchant,
  storeAssociatedAccount,
};
