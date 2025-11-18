import {signOut, useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AccountBalance() {

    const { data: session } = useSession();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut({ redirect: false }); // ⛔ pas de redirection automatique
        router.push("/"); // ✅ redirection vers home
    };
    return (
        <section className="p-6 bg-card rounded-2xl shadow-md space-y-6">
            <h1 className="text-2xl font-bold text-primary">Mon compte</h1>

            <p className="text-gray-600 text-secondary">
                Gérez votre profil et votre wallet ici.
            </p>

            {/* Infos utilisateur */}
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="font-medium text-gray-700 text-theme">Nom :</span>
                    <span className="text-gray-900 text-accent">{session?.user?.name}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium text-gray-700 text-theme">Email :</span>
                    <span className="text-gray-900 text-accent">{session?.user?.email}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700 text-theme">Solde :</span>
                    <span className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200 px-3 py-1 rounded-full font-semibold">
        {session?.user?.balance ?? 0}
      </span>
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 gap-4 mt-4">
                <Link
                    href="/deposit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold p-2 rounded-lg shadow transition"
                >
                    Dépôt
                </Link>

                <Link
                    href="/withdraw"
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold p-2 rounded-lg shadow transition"
                >
                    Retrait
                </Link>

                <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold p-2 rounded-lg shadow transition"
                >
                    Déconnexion
                </button>
            </div>
        </section>

    );
}