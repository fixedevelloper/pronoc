"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { LinePotFoot, Pot } from "../../../../types/types";
import axiosServices from "../../../../utils/axiosServices";
import AccountBalance from "../../../../components/layout/AccountBalance";
import AccountNavigation from "../../../../components/layout/AccountNavigation";
import { motion } from "framer-motion";

export default function MyPotsDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const { data: session, status } = useSession();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [pot, setPot] = useState<Pot | null>(null);
    const [lines, setLines] = useState<LinePotFoot[]>([]);
    const [leaderboards, setLeaderboards] = useState<any[]>([]);

    useEffect(() => {
        if (status === "unauthenticated") router.push("/auth/login");
    }, [status]);

    const fetchPots = async () => {
        if (!session) return;

        setLoading(true);
        try {
            const res = await axiosServices.get(`/api/pots/${id}/leaderboard`);
            setPot(res.data.pot);
            setLines(res.data.lines);
            setLeaderboards(res.data.leaderboards);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPots(); }, [session]);

    if (status === "loading") return <p className="text-center mt-10">Chargement...</p>;

    return (
        <div className="max-w-8xl mx-auto mt-8 px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* ---- SIDEBAR ---- */}
            <div className="md:col-span-1 space-y-6">
                <AccountBalance />
                <AccountNavigation />
            </div>

            {/* ---- CONTENT ---- */}
            <div className="md:col-span-2 space-y-6">

                {/* HEADER POT */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card p-6 rounded-xl shadow-lg border border-border"
                >
                    <h1 className="text-3xl font-extrabold text-theme">
                        {pot?.name ?? "Détails du Pot"}
                    </h1>
                    {pot?.description && (
                        <p className="text-muted mt-1">{pot.description}</p>
                    )}
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* ---- MATCHES ---- */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-theme">Matchs & Points</h2>

                        {loading && [...Array(4)].map((_, i) => (
                            <div key={i} className="p-4 bg-card rounded-lg animate-pulse h-24"></div>
                        ))}

                        {!loading && lines.map(line => {
                            const homeFav = line.team_home_fav;
                            const awayFav = line.team_away_fav;

                            return (
                                <motion.div
                                    key={line.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-card rounded-lg shadow-md hover:shadow-xl transition"
                                >
                                    <div className="flex items-center gap-4">

                                        {/* HOME */}
                                        <div className={`flex items-center gap-2 p-2 rounded-lg flex-1 border ${homeFav ? "bg-green-50 dark:bg-green-900/20 border-green-400" : "border-border"}`}>
                                            <img src={line.team_home_logo} className="w-8 h-8 rounded-full" />
                                            <span className="font-medium">{line.team_home}</span>
                                            {line.score_home !== undefined && (
                                                <span className="ml-auto font-bold text-theme">{line.score_home}</span>
                                            )}
                                        </div>

                                        <span className="font-bold opacity-60">vs</span>

                                        {/* AWAY */}
                                        <div className={`flex items-center gap-2 p-2 rounded-lg flex-1 border ${awayFav ? "bg-green-50 dark:bg-green-900/20 border-green-400" : "border-border"}`}>
                                            <img src={line.team_away_logo} className="w-8 h-8 rounded-full" />
                                            <span className="font-medium">{line.team_away}</span>
                                            {line.score_away !== undefined && (
                                                <span className="ml-auto font-bold text-theme">{line.score_away}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="font-bold text-blue-600 dark:text-blue-300 mt-3">
                                        Points obtenus : {line.points ?? 0}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* ---- LEADERBOARD ---- */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-theme">Classement</h2>

                        <section className="bg-card p-4 rounded-lg shadow-md border border-border">

                            {loading && [...Array(5)].map((_, i) => (
                                <div key={i} className="h-12 bg-muted rounded animate-pulse mb-2"></div>
                            ))}

                            {!loading && (
                                <ul className="space-y-2">
                                    {leaderboards.map((leaderboard, index) => (
                                        <motion.li
                                            key={leaderboard.user_id}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold w-6 text-blue-600 dark:text-blue-400">
                                                    {index + 1}
                                                </span>

                                                {leaderboard.avatar && (
                                                    <img
                                                        src={leaderboard.avatar}
                                                        className="w-10 h-10 rounded-full object-cover border"
                                                    />
                                                )}

                                                <span className="font-medium text-theme">
                                                    {leaderboard.name}
                                                </span>
                                            </div>

                                            <span className="font-bold text-theme">
                                                {leaderboard.points} pts
                                            </span>
                                        </motion.li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
