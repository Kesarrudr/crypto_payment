import { Prisma, prisma } from "@repo/database";
import { Account } from "@solana/spl-token";
import { AppError } from "../funtions/AppError";
import { getWalletDetails, WalletData } from "../funtions/generate_wallet";
import { getHashPassword, StatusCode } from "../funtions/helperFunctions";
import { MerchantDetialsType, RegisterMerchantType } from "../funtions/zod";

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

const associatedTokenAccountDetails = async ({
  username,
  publickey,
  mint,
}: MerchantDetialsType) => {
  try {
    const account = await prisma.associatedTokenAccount.findUniqueOrThrow({
      where: {
        stableTokenMint_merchantUserName: {
          stableTokenMint: mint,
          merchantUserName: username,
        },
        merchant: {
          publicKey: publickey,
        },
      },
      select: {
        accountAddress: true,
        stableTokenMint: true,
      },
    });

    return account;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new AppError(
          `Can't find account address of ${publickey} public key for this ${mint} mint`,
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

const acceptedMint = async (mint: string) => {
  try {
    //TODO: have the TOKEN_SPL_PROGRAM also in the databse
    const mintDetails = await prisma.stableToken.findUniqueOrThrow({
      where: {
        mint: mint,
      },
      select: {
        mint: true,
      },
    });
    return mintDetails;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new AppError(
          `Can't find any STABLE TOKEN mint with ${mint} address`,
          StatusCode.BAD_REQUEST,
        );
      }
      throw new AppError(
        "Some Prisma Error",
        StatusCode.INTERNAL_SERVER_ERROR,
        false,
      );
    } else {
      console.log("Error form acceptedMint", error);
      throw new AppError(
        "DATA BASE ERROR",
        StatusCode.SERVICE_UNAVAILABLE,
        false,
      );
    }
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
        username: true,
        publicKey: true,
        privateKey: true,
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
  merchantUsername: string,
  merchantPublicKey: string,
  accountDetails: Account,
) => {
  try {
    return await prisma.associatedTokenAccount.upsert({
      where: {
        stableTokenMint_merchantUserName: {
          stableTokenMint: accountDetails.mint.toBase58(),
          merchantUserName: merchantUsername,
        },
        merchant: {
          publicKey: merchantPublicKey,
        },
      },
      create: {
        accountAddress: accountDetails.address.toBase58(),
        stableTokenMint: accountDetails.mint.toBase58(),
        merchantUserName: merchantUsername,
      },
      update: {
        accountAddress: accountDetails.address.toBase58(),
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new AppError(
        `Error while creating, updating the token account of ${merchantUsername} user for ${accountDetails.mint.toBase58()} mint`,
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
    const merchantUsername = await prisma.merchant.findMany({
      where: {
        username: username,
      },
      select: {
        username: true,
        publicKey: true,
      },
    });
    return merchantUsername;
  } catch (error) {}
};

export {
  merchantUserName,
  acceptedMint,
  associatedTokenAccountDetails,
  getMerchantDetails,
  merchantKeysDetails,
  registerMerchant,
  storeAssociatedAccount,
};
