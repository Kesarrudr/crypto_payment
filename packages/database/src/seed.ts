import { prisma } from "./client";

const DEFAULT_USERS = [
  {
    username: "ayam",
    password: "$2b$10$9dw8A4iRGPKHV6s.61YXefxIwKzWh38n7HkwNwaQp421C/pUi", // Hashed password
    mnemonic:
      "minimum doctor useful insect goddess wasp bright veteran outdoor allow allow stumble",
    publicKey: "ExH49ofTzE21RdaZm8XdEKztap7eF7vpUttfnzvRQGQX",
    privateKey:
      "418lxwFgxiC7IciidjQ65jJ5tF2hY643Jcui1CB7be209JdJubaWT129HGFt4NL1zWJ8gi1U98JNNk5H9fKHa39M",
  },
  {
    username: "rudr",
    password: "$2b$10$F6R9T67FbpRzteqSxBaL.ui4TQ9ZKS/R3/2iPcn1JPhxVhC4N",
    mnemonic:
      "symbol pull rhythm unfold vacant donkey stand drum ski social say dinner",
    publicKey: "5jq4oFeJHSWngGmAoHWg5Ang1o4B1NfGGa5dMFNpZDUz",
    privateKey:
      "2J1BCh5vy5aYzF7KQ485d5gFuxR14cfVSkD8R9vesq4HqQFJr1zHc3vrPALKFg-aagB72B8c3nAvVa3kFFc8cN",
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
