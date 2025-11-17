import {getSession, signOut} from "next-auth/react";

export const getAuthToken = async () => {
    try {
        const session = await getSession();
        if (session?.token) return session.token;
    } catch (e) {
        console.warn("⚠️ Impossible de récupérer la session:", e);
        return null;
    }
};

export const verifyExpired = async () => {
    try {
        await signOut()
    } catch (e) {
        console.warn("⚠️ Impossible de récupérer la session:", e);

    }
};