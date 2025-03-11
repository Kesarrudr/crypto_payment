import { prisma } from "./client";

const DEFAULT_USERS = [
  {
    username: "sanjay",
    password: "$2b$10$XnUgHDAlG6wCQqJwKVXe.udfVrdVmcYThP0HLYkPjGhv22EuXyEya",
    mnemonic:
      "rebel shoe review column bring supreme during fruit uniform stem donate monkey",
    publicKey: "E81S7SmmarSGa2Mizs1XzfSDxSNWLBiVdcK9NPSPtgCE",
    privateKey:
      "3bzHpLxBhQAGi1jviEnAQ9qTFxLUd7WWN8k9fQYQjCkpjpaUKyszEDBHMvYSVUohZ8i9UHxADbS9UAAYbyBGgqup",
  },
  {
    username: "anjana",
    password: "$2b$10$9ZXDYKxIVQOlP34ItF/dk.07zfqdaSQsLPPrqHNAIbM5wCpvuUM5W",
    mnemonic:
      "usual vessel near donor acoustic govern cruise club agree box chat body",
    publicKey: "4JtPeXGyYPYct1rb4ZGUaBMiQ1vrYsAZncBp1RWa4vgm",
    privateKey:
      "5hVeE46xWAs8gizTEcnBfbTkwS1L44N2KLFHyDrpMmkYVUiNNMyCZLixKyagJd2f6QK9asHorc7EYq4pJzCCbdG9",
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
