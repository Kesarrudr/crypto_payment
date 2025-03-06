import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      authToken?: string; // ✅ Add the missing authToken field
      publicKey?: string;
    };
  }
}
