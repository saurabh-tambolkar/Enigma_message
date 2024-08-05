import NextAuth, { CredentialsSignin } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialProvider from "next-auth/providers/credentials";
import connectDB from "./lib/dbConnect";
import User from "@/model/User";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    CredentialProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        // console.log("connected db");
        const email = credentials.identifier;
        const password = credentials.password;

        // console.log("Credentials received:", { email,password });

        try {
          await connectDB();
          const user = await User.findOne({email})
          if (!user) {
            // console.log("User not found")
            return null;
            // throw new Error("User not found");
          } else {
            const isMatched = await bcrypt.compare(password, user.password);
            if (!isMatched) {
            //   throw new Error("Invalid password");
              // console.log("Invalid password")
              return null;
            } else {
                // console.log("logged in successfully")
                // console.log("thisis user from auth",user)
              return user;
            }
          }
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.username = user.username;
        token.isVerified = user.isVerified; 
        token.isAcceptingMessages = user.isAcceptingMessages; 
      }
      return token;
    },
    async session({ session, token }) {
      if(token){
        // console.log("session added")
        session.user._id = token._id;
        session.user.username = token.username;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret:process.env.AUTH_SECRET
});
