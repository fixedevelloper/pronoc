'use client';

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import AccountCard from "./components/AccountCard";
import AccountBalance from "../../components/layout/AccountBalance";
import AccountNavigation from "../../components/layout/AccountNavigation";
import { useRouter } from "next/navigation";
import {useEffect} from "react";

export default function AccountPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return <p>Chargement...</p>;
    }

    if (status === "unauthenticated") {
        return null; // redirection en cours
    }
    return (
        <div className="max-w-8xl mx-auto mt-8 px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* SIDEBAR */}
            <div className="md:col-span-1 space-y-6">

                {/* Card Profil */}
            <AccountBalance />

                {/* Menu navigation */}
                <AccountNavigation />
            </div>

            {/* CONTENU */}
            <div className="md:col-span-2">
                <AccountCard />
            </div>
        </div>
    );
}

