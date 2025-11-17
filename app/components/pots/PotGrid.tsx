'use client';
import { useEffect, useState, useRef, useCallback } from "react";
import axiosServices from "../../utils/axiosServices";
import {Pot, PotStatus} from "../../types/types";
import clsx from "clsx";
import Link from "next/link";

export default function PotsGrid() {
    const [pots, setPots] = useState<Pot[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const observer = useRef<IntersectionObserver>(undefined);
    const lastPotElementRef = useCallback((node:any) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    useEffect(() => {
        const fetchCurrentPots = async () => {
            setLoading(true);
            try {
                const res = await axiosServices.get(`/api/pots?page=${page}`);
                // ✅ Accéder à res.data.data si paginate est utilisé
                const newPots = res.data.data || [];
                setPots(prev => [...prev, ...newPots]);

                // S’il n’y a plus de données, on stoppe le scroll infini
                if (newPots.length === 0) {
                    setHasMore(false);
                }
            } catch (err) {
                console.warn("Erreur API:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCurrentPots();
    }, [page]);


    const formatDateDiff = (dateStr: string) => {
        const created = new Date(dateStr).getTime();
        const now = Date.now();
        return now - created < 24 * 60 * 60 * 1000; // moins de 24h => nouveau
    };

    const statusColors: Record<PotStatus, string> = {
        open: "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100",
        closed: "bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100",
        settled: "bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100"
    };

    if (pots.length === 0 && !loading) {
        return <p className="text-gray-500 dark:text-gray-400 mt-4">Aucun pot disponible pour le moment.</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {pots.map((pot, index) => {
                const isLast = pots.length === index + 1;
                const isJoined = pot.is_joined;

                // Barre de progression
                const progressPercent = Math.min(
                    ((pot.total_amount || 0) / (pot.entry_fee * (pot.participants_count || 1))) * 100,
                    100
                );

                return (
                    <div
                        key={pot.id}
                        ref={isLast ? lastPotElementRef : null}
                        className={clsx(
                            "rounded-xl p-6 flex flex-col justify-between shadow-md transform transition-all duration-300",
                            "hover:shadow-xl hover:-translate-y-1",
                            isJoined ? "border-2 border-blue-500" : "bg-card",
                            "opacity-0 animate-fadeIn"
                        )}
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="font-bold text-xl text-gray-900 text-primary">{pot.name}</h2>
                                {formatDateDiff(pot.created_at) && (
                                    <span className="px-2 py-0.5 text-xs bg-blue-600 text-theme rounded-full">Nouveau</span>
                                )}
                            </div>

                            <p className="text-sm text-gray-500 text-theme">
                                Frais d'entrée : <span className="font-semibold">{pot.entry_fee}€</span>
                            </p>
                            <p className="text-sm text-gray-500 text-theme mt-1">
                                Gagnant : <span className="font-semibold">{pot.distribution_rule}</span>
                            </p>

                            {/* Barre de progression */}
                            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-3">
                                <div
                                    className="h-2 bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-4">
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[pot.status]}`}>
        {pot.status === "open" ? "Ouvert" : pot.status === "closed" ? "Fermé" : "Terminé"}
    </span>

                            <Link href={`/pots/${pot.id}`} passHref>
                                <button
                                    className="py-2 px-4 bg-blue-600 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                                    disabled={isJoined || pot.status !== "open"}
                                >
                                    {isJoined ? "Déjà rejoint" : "Rejoindre"}
                                </button>
                            </Link>
                        </div>
                    </div>
                );
            })}

            {/* Skeleton loader */}
            {loading &&
            Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse h-44" />
            ))
            }
        </div>
    );
}
