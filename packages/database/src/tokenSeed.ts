import { prisma } from "./client";
import { TokenAddress } from "./tokenData";

(async () => {
  try {
    await Promise.all(
      Object.values(TokenAddress).map((token) =>
        prisma.swapableTokens.upsert({
          where: { tokenAddress: token.tokenAddress }, // Updated field to match schema
          update: {},
          create: {
            tokenAddress: token.tokenAddress, // Updated from mintAddress
            name: token.name,
            symbol: token.symbol, // TODO: still spelled "symobol" as per schema
            decimals: token.decimals,
            logoURL: token.logoURL,
            tags: [...token.tags],
            tokenCreatedAt: token.tokenCreatedAt,
            freeze_authority: token.freeze_authority ?? "N/A",
            mint_authority: token.mint_authority ?? "N/A",
            tokenOwner: "N/A", // Add default as it's required in schema
          },
        }),
      ),
    );

    console.log("✅ Tokens seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding tokens:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
