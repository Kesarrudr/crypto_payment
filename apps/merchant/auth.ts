import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { axiosPostRequest } from "@repo/axios-config";
import { LoginMerchantDataType, SendResponseType, StatusEnum } from "@repo/api";

const authHandlers = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing username or password");
        }

        try {
          const response: SendResponseType<LoginMerchantDataType> =
            await axiosPostRequest<
              { username: string; password: string },
              LoginMerchantDataType
            >("/merchant/signin", {
              username: credentials.username,
              password: credentials.password,
            });

          if (response.status !== StatusEnum.success || !response.data) {
            throw new Error("Invalid credentials");
          }

          return {
            id: response.data.WalletAddress,
            username: credentials.username,
            publicKey: response.data.WalletAddress,
            authToken: response.data.AuthToken,
          } as User;
        } catch (error) {
          throw new Error("Failed to authenticate");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.authToken = user.authToken;
        token.publicKey = user.publicKey;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.authToken = token.authToken as string;
      session.user.publicKey = token.publicKey as string;
      session.user.username = token.username as string;

      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
});

export { authHandlers as handlers };
