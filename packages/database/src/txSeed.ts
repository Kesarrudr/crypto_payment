import { prisma } from "./client";
import { TokenAddress } from "./tokenData";

enum txStatus {
  failed = "failed",
  success = "success",
}

const MERCHANTS = ["sanjay", "anjana"];
const NUM_TRANSACTIONS = 100;
const TX_STATUSES = Object.values(txStatus);

function getRandomToken() {
  const tokens = Object.values(TokenAddress);
  return tokens[Math.floor(Math.random() * tokens.length)];
}

function getRandomAmount(decimals: any) {
  return Math.floor(Math.random() * 10000) * 10 ** decimals; // Random large token amount
}

function getRandomDateTime() {
  const date = new Date(
    Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000),
  );
  return {
    date: date.toISOString().split("T")[0],
    time: date.toISOString().split("T")[1].split(".")[0],
  };
}

(async () => {
  try {
    const transactions = [];
    for (const merchant of MERCHANTS) {
      for (let i = 0; i < NUM_TRANSACTIONS; i++) {
        const token = getRandomToken();
        const { date, time } = getRandomDateTime();

        transactions.push(
          prisma.merchantTransaction.create({
            data: {
              tokenAmount: getRandomAmount(token.decimals),
              tokenAddress: token.tokenAddress,
              Date: date,
              Time: time,
              payerAddress: `Payer_${Math.random().toString(36).slice(2, 10)}`,
              signature: `Sig_${Math.random().toString(36).slice(2, 15)}`,
              merchantUserName: merchant,
              USDTAmount: Math.floor(Math.random() * 1000),
              SwapRate: Math.floor(Math.random() * 100),
              Status:
                TX_STATUSES[Math.floor(Math.random() * TX_STATUSES.length)],
            },
          }),
        );
      }
    }
    await Promise.all(transactions);
    console.log("✅ Merchant transactions seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding merchant transactions:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
