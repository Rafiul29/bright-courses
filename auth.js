import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { User } from "./models/user-model";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

async function refreshAccessToken(token, provider) {
  try {
    let url = "";

    if (provider === "google") {
      url =
        "https://oauth2.googleapis.com/token?" +
        new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          grant_type: "refresh_token",
          refresh_token: token.refreshToken,
        });
    } else if (provider === "credentials") {
      // For credentials, you likely don't have a refresh endpoint.
      // Simply return the token unchanged (or implement your own refresh logic).
      return token;
    } else {
      // Unknown provider – return token as is.
      return token;
    }

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      // Use new refresh token if provided; otherwise, keep the current one.
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials) return null;
        try {
          const user = await User.findOne({ email: credentials.email });
          console.log(user);

          if (user) {
            const isMatch = await bcrypt.compare(
              credentials.password,
              user.password
            );

            if (isMatch) {
              return user;
            } else {
              // console.error("password mismatch");
              throw new Error("Check your password");
            }
          } else {
            // console.error("User not found");
            throw new Error("User not found");
          }
        } catch (err) {
          console.error(err);
          throw new Error(err);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // console.log(`JWT token: ${JSON.stringify(token)}`);
      // console.log(`JWT Account: ${JSON.stringify(account)}`);

      // Initial sign in – store tokens and provider info.
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + account.expires_in * 1000,
          refreshToken: account.refresh_token,
          user,
          provider: account.provider, // e.g., "google" or "credentials"
        };
      }

      // console.log(`Token Will Expire at ${new Date(token.accessTokenExpires)}`);

      // If token is still valid, return it.
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Otherwise, attempt to refresh the token.
      return refreshAccessToken(token, token.provider);
    },
    async session({ session, token }) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.error = token.error;
      // console.log(`Returning Session ${JSON.stringify(session)}`);
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/auth/signin", // Your custom sign in page
    error: "/auth/error", // Custom error page
  },
});
