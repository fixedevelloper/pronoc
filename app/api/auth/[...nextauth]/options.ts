import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { randomBytes } from "crypto";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                phone: { label: "Téléphone", type: "text", placeholder: "Entrez votre téléphone" },
                password: { label: "Mot de passe", type: "password" },
            },

            async authorize(credentials) {
                console.log('geasss')
                if (!credentials?.phone || !credentials?.password) {
                    throw new Error("Téléphone et mot de passe requis");
                }

                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            phone: credentials.phone,
                            password: credentials.password,
                        }),
                    });

                    console.log("API response status:", res.status);
                    const result = await res.json();
                    console.log("API response data:", result);

                    if (!res.ok) {
                        throw new Error(result.message || "Erreur serveur");
                    }

                    if (result.status === "success" && result.data?.token) {
                        return {
                            id: result.data.id,
                            name: result.data.name,
                            email: result.data.email || null,
                            token: result.data.token,
                            role: result.data.role || "user",
                            balance: result.data.balance || 0.0,
                        };
                    }

                    throw new Error(result.message || "Identifiants invalides");
                } catch (error: any) {
                    console.error("🔥 Erreur authorize():", error);
                    throw new Error("Impossible de se connecter au serveur");
                }
            },
        }),
    ],

    secret: process.env.NEXTAUTH_SECRET ?? "fallback_secret_key",

    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 24h
        generateSessionToken: () => randomBytes(32).toString("hex"),
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.role = user.role;
                token.token = user.token;
                token.balance = user.balance;
            }
            return token;
        },

        async session({ session, token }) {
            session.user = {
                id: String(token.id),
                name: token.name,
                email: token.email,
                balance: String(token.balance),
                role: token.role as string,
            };
            session.token = token.token as string;
            return session;
        },
    },
};