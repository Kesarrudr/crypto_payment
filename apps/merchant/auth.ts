import { LoginMerchantDataType, SendResponseType } from "@repo/api";
import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { axiosPostRequest } from "./axios-config/axios";
import { AxiosError } from "axios";

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

          if (response.status !== "success" || !response.data) {
            throw new Error("Invalid credentials");
          }

          return {
            id: response.data.WalletAddress,
            username: credentials.username,
            publicKey: response.data.WalletAddress,
            authToken: response.data.AuthToken,
          } as User;
        } catch (error) {
          if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
          }
          throw new Error("Something is Wrong");
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
