"use client";
import { useState, useEffect } from "react";
import { useSession} from "next-auth/react";
import { useParams } from "next/navigation";
import { LinePotFoot, Pot } from "../../../../types/types";
import axiosServices from "../../../../utils/axiosServices";
import AccountBalance from "../../../../components/layout/AccountBalance";
import AccountNavigation from "../../../../components/layout/AccountNavigation";

export default function MyPotsDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const { data: session } = useSession();

    const [loading, setLoading] = useState(true);
    const [pot, setPot] = useState<Pot | null>(null);
    const [lines, setLines] = useState<LinePotFoot[]>([]);
    const [leaderboards, setLeaderboards] = useState<any[]>([]);

    const fetchPots = async () => {
        if (!session) return;

        setLoading(true);
        try {
            const res = await axiosServices.get(`/api/pots/${id}/leaderboard`);
            setLines(res.data.lines);
            setLeaderboards(res.data.leaderboards);
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
                <AccountBalance />

                {/* Navigation */}
                <AccountNavigation />
            </div>

            {/* ---------------- CONTENU ---------------- */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* --------- COLONNE GAUCHE : MATCHS --------- */}
                <div className="space-y-4">
                    <h1 className="text-2xl font-bold text-blue-600 mb-4">
                        {pot?.name ?? "Détails du Pot"}
                    </h1>

                    {loading ? (
                        <p className="text-center mt-10">Chargement...</p>
                    ) : (
                        lines.map(line => {
                            const homeFav = line.team_home_fav;
                            const awayFav = line.team_away_fav;

                            return (
                                <div
                                    key={line.id}
                                    className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col gap-4 transition hover:shadow-lg"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`flex items-center gap-2 p-2 rounded ${homeFav ? "bg-green-100 dark:bg-green-700" : ""}`}>
                                            <img src={line.team_home_logo} className="w-8 h-8 rounded-full" />
                                            <span>{line.team_home}</span>
                                            {line.score_home !== undefined && (
                                                <span className="ml-auto font-bold">{line.score_home}</span>
                                            )}
                                        </div>

                                        <span className="mx-2 font-bold">vs</span>

                                        <div className={`flex items-center gap-2 p-2 rounded ${awayFav ? "bg-green-100 dark:bg-green-700" : ""}`}>
                                            <img src={line.team_away_logo} className="w-8 h-8 rounded-full" />
                                            <span>{line.team_away}</span>
                                            {line.score_away !== undefined && (
                                                <span className="ml-auto font-bold">{line.score_away}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="font-semibold text-gray-700 dark:text-gray-200">
                                        Points : {line.points ?? 0}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* --------- COLONNE DROITE : CLASSEMENT --------- */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-blue-600 mb-4">Classement</h2>
                <section className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md h-max">


                    {loading ? (
                        <p className="text-center">Chargement...</p>
                    ) : (
                        <ul className="space-y-2">
                            {leaderboards.map((leaderboard, index) => (
                                <li
                                    key={leaderboard.user_id}
                                    className="flex items-center justify-between p-2 rounded hover:bg-blue-50 dark:hover:bg-gray-700 transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold w-6">{index + 1}</span>

                                        {leaderboard.avatar && (
                                            <img
                                                src={leaderboard.avatar}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        )}

                                        <span className="font-medium">{leaderboard.name}</span>
                                    </div>

                                    <span className="font-semibold text-gray-700 dark:text-gray-200">
                            {leaderboard.points} pts
                        </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
                </div>

            </div>

        </div>
    );
}
