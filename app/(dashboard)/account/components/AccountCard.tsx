

"use client";
import { useSession } from "next-auth/react";
import { ArrowRight, Trophy, Wallet, ListChecks } from "lucide-react";
import {Card, CardContent, CardHeader} from "../../../components/ui/card";
import Link from "next/link";

export default function AccountCard() {
    const { data: session } = useSession();

    return (
        <div className="mx-auto mt-10 space-y-10 px-4 max-w-6xl">

            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-extrabold text-theme">
                    Mon Dashboard
                </h1>
                <p className="text-muted mt-1">
                    Bienvenue {session?.user?.name ?? "👋"}, voici un aperçu de votre activité.
                </p>
            </div>

            {/* GRID DASHBOARD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* CARTE SOLDE */}
                <Card className="bg-card shadow-md hover:shadow-xl transition">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-lg">Solde disponible</h2>
                            <Wallet className="w-6 h-6 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-theme">{session?.user.balance} FCFA</p>
                        <Link href='account/deposit' className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
                            Déposer <ArrowRight size={16} />
                        </Link>
                    </CardContent>
                </Card>

                {/* CARTE POTS REJOINTS */}
                <Card className="bg-card shadow-md hover:shadow-xl transition">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-lg">Pots rejoints</h2>
                            <ListChecks className="w-6 h-6 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-theme">8</p>
                        <button  href='/account/pots' className="mt-4 border px-4 py-2 rounded-lg text-theme hover:bg-muted transition">
                            Voir mes pots
                        </button>
                    </CardContent>
                </Card>

                {/* CARTE POINTS */}
                <Card className="bg-card shadow-md hover:shadow-xl transition">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-lg">Points gagnés</h2>
                            <Trophy className="w-6 h-6 text-yellow-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-theme">247</p>
                        <button className="mt-4 border px-4 py-2 rounded-lg text-theme hover:bg-muted transition">
                            Voir classement
                        </button>
                    </CardContent>
                </Card>

            </div>

            {/* SECTION STATISTIQUES */}
            <div className="bg-card p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold mb-4 text-theme">Statistiques générales</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted">Total pronostics joués</p>
                        <p className="text-2xl font-bold text-theme mt-1">54</p>
                    </div>

                    <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted">Total pronostics corrects</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">32</p>
                    </div>

                    <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted">Taux de précision</p>
                        <p className="text-2xl font-bold text-blue-600 mt-1">59%</p>
                    </div>

                    <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted">Total gains cumulés</p>
                        <p className="text-2xl font-bold text-yellow-600 mt-1">18 700 FCFA</p>
                    </div>

                </div>
            </div>

        </div>
    );
}

