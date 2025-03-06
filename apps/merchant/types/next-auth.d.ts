import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    username: string;
    authToken: string;
    publicKey: string;
  }

  interface Session {
    user: {
      username: string;
      authToken: string;
      publicKey: string;
    };
  }

  interface JWT {
    username: string;
    authToken: string;
    publicKey: string;
  }
}
