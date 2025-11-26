import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";

export const authOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize({ email, password }) {
        console.log("AUTHORIZE RUNNING:", email, password);

        const db = await getDb();
        const [rows] = await db.execute(
          "SELECT * FROM users WHERE email = ? LIMIT 1",
          [email]
        );

        console.log("ROWS:", rows);

        if (rows.length === 0) {
          console.log("NO USER FOUND");
          return null;
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);

        console.log("MATCH:", match);

        if (!match) {
          console.log("WRONG PASSWORD");
          return null;
        }

        const returnUser = {
          id: user.id_user,
          username: user.username,
          email: user.email,
          role: user.role,
        };

        console.log("RETURN:", returnUser);
        return returnUser;
      }

    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
};

// wajib dibungkus pakai authOptions
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
