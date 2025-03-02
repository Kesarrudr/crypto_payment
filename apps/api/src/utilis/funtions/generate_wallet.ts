import { Keypair } from "@solana/web3.js";
import { generateMnemonic, mnemonicToSeed } from "bip39";
import bs58 from "bs58";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";

interface WalletData {
  nemonic: string;
  primaryWallet: {
    primary_publicKey: string;
    primary_privateKey: string;
  };
}

const getWalletDetails = async (): Promise<WalletData> => {
  const phrase = generateMnemonic();
  const seed = await mnemonicToSeed(phrase);
  const path = `m/44'/501'/0'/0'`;
  const primaryderivedSeed = derivePath(path, seed.toString("hex")).key;

  const primarysecret =
    nacl.sign.keyPair.fromSeed(primaryderivedSeed).secretKey;
  const wallet = Keypair.fromSecretKey(primarysecret);

  return {
    nemonic: phrase,
    primaryWallet: {
      primary_publicKey: wallet.publicKey.toBase58(),
      primary_privateKey: bs58.encode(primarysecret),
    },
  };
};

export { getWalletDetails, type WalletData };
