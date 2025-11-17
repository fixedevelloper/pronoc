"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import axiosServices from "../../../utils/axiosServices";
import AccountBalance from "../../../components/layout/AccountBalance";
import AccountNavigation from "../../../components/layout/AccountNavigation";

interface UserPot {
    id: number;
    name: string;
    entry_fee: number;
    status: "open" | "closed";
    participants: number;
    type?: string;
}

export default function MyPronosticPage() {
    const { data: session } = useSession();

    const [loading, setLoading] = useState(true);
    const [pots, setPots] = useState<UserPot[]>([]);

    // FILTRES
    const [search, setSearch] = useState("");
    const [type, setType] = useState("");
    const [status, setStatus] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const fetchPots = async () => {
        if (!session) return;

        setLoading(true);
        try {
            const res = await axiosServices.get("/api/account/pronostics", {
                params: { q: search, type, status, from, to },
            });
            setPots(res.data.data ?? []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPots(); }, [session]);

    return (
        <div className="max-w-8xl mx-auto mt-8 px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* ---------------- SIDEBAR ---------------- */}
            <div className="md:col-span-1 space-y-6">
                {/* Profil */}
                <AccountBalance />

                {/* Navigation */}
           <AccountNavigation />

                {/* Filtrage */}
                <section className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow space-y-3">
                    <h2 className="font-semibold text-lg">Filtres</h2>
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        className="w-full p-2 rounded border dark:bg-gray-700"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <select className="p-2 rounded border dark:bg-gray-700" value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="">Type</option>
                            <option value="pari">Pari</option>
                            <option value="score">Score</option>
                            <option value="multi">Multi</option>
                        </select>
                        <select className="p-2 rounded border dark:bg-gray-700" value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="">Statut</option>
                            <option value="open">En cours</option>
                            <option value="closed">Terminé</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <input type="date" className="p-2 rounded border dark:bg-gray-700" value={from} onChange={(e) => setFrom(e.target.value)} />
                        <input type="date" className="p-2 rounded border dark:bg-gray-700" value={to} onChange={(e) => setTo(e.target.value)} />
                    </div>
                    <button onClick={fetchPots} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-500">Filtrer</button>
                </section>
            </div>

            {/* ---------------- CONTENU ---------------- */}
            <div className="md:col-span-2">
                <h1 className="text-2xl font-bold text-blue-600 mb-4">Mes Pronostiques</h1>

                {loading ? (
                    <p className="text-center mt-10">Chargement...</p>
                ) : pots.length === 0 ? (
                    <div className="text-center mt-10 text-gray-700 dark:text-gray-300">
                        Aucun pot trouvé.
                        <br />
                        <Link href="/pots" className="text-blue-600 font-semibold hover:underline">Voir les pots disponibles →</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pots.map((pot) => (
                            <div key={pot.id} className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col justify-between hover:shadow-lg transition">
                                <div className="space-y-2">
                                    <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{pot.name}</h2>
                                    <p className="text-gray-600">Mise : {pot.entry_fee} €</p>
                                    <p className="text-gray-600">Participants : {pot.participants}</p>
                                    <span className={`inline-block mt-2 px-3 py-1 text-sm rounded-full font-semibold ${pot.status === "open" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                        {pot.status === "open" ? "En cours" : "Terminé"}
                                    </span>
                                </div>
                                <Link href={`/account/pronostics/${pot.id}`} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition text-center">
                                    Voir détails
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
