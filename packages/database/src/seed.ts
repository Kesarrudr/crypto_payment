import { prisma } from "./client";

const DEFAULT_USERS = [
  {
    username: "ayam",
    password: "$2b$10$3Shl.kj/1I/bjVAGfdfW7ep7akvzHBBUrKehh.WCqcvjvn6Txn5km", // Hashed password
    mnemonic:
      "minimum doctor useful insect goddess wasp bright veteran outdoor allow allow stumble",
    publicKey: "ExH49ofTzE21RdaZm8XdEKztap7eF7vpUttfnzvRQGQX",
    privateKey:
      "418lxwFgxiC7IciidjQ65jJ5tF2hY643Jcui1CB7be209JdJubaWT129HGFt4NL1zWJ8gi1U98JNNk5H9fKHa39M",
  },
  {
    username: "rudr",
    password: "$2b$10$3Shl.kj/1I/bjVAGfdfW7ep7akvzHBBUrKehh.WCqcvjvn6Txn5km",
    mnemonic:
      "symbol pull rhythm unfold vacant donkey stand drum ski social say dinner",
    publicKey: "5jq4oFeJHSWngGmAoHWg5Ang1o4B1NfGGa5dMFNpZDUz",
    privateKey:
      "2J1BCh5vy5aYzF7KQ485d5gFuxR14cfVSkD8R9vesq4HqQFJr1zHc3vrPALKFg-aagB72B8c3nAvVa3kFFc8cN",
  },
  {
    username: "sanjay",
    password: "$2b$10$XnUgHDAlG6wCQqJwKVXe.udfVrdVmcYThP0HLYkPjGhv22EuXyEya",
    mnemonic:
      "rebel shoe review column bring supreme during fruit uniform stem donate monkey",
    publicKey: "E81S7SmmarSGa2Mizs1XzfSDxSNWLBiVdcK9NPSPtgCE",
    privateKey:
      "3bzHpLxBhQAGi1jviEnAQ9qTFxLUd7WWN8k9fQYQjCkpjpaUKyszEDBHMvYSVUohZ8i9UHxADbS9UAAYbyBGgqup",
  },
];

(async () => {
  try {
    await Promise.all(
      DEFAULT_USERS.map((user) =>
        prisma.merchant.upsert({
          where: { username: user.username }, // Ensuring uniqueness
          update: { ...user },
          create: { ...user },
        }),
      ),
    );
    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
