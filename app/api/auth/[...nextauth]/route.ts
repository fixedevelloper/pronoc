import NextAuth from 'next-auth'
import { authOptions } from "./options"; // ✅ correct

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }