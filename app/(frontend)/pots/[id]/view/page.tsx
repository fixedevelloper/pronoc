"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axiosServices from "../../../../utils/axiosServices";
import { LinePotFoot, Pot } from "../../../../types/types";
import PotShareButton from "../../../../components/PotShareButton";

export default function PotViewPage() {
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [pot, setPot] = useState<Pot | null>(null);
    const [lines, setLines] = useState<LinePotFoot[]>([]);
    const [leaderboards, setLeaderboards] = useState<any[]>([]);

    const fetchPotDetails = async () => {
        setLoading(true);
        try {
            const res = await axiosServices.get(`/api/pots/${id}/details`);

            // IMPORTANT : mettre le pot
            setPot(res.data.pot);

            setLines(res.data.lines);
            setLeaderboards(res.data.leaderboards);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPotDetails();
    }, []);

    const isJoined = pot?.is_joined;

    return (
        <div className="max-w-7xl mx-auto mt-8 px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* ---------------- COLONNE MATCHS ---------------- */}
            <div className="md:col-span-2 space-y-6">

                {/* ENTÊTE */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border">

                    {/* TITRE POT */}
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-700 tracking-tight">
                        {pot?.name ?? "Détails du Pot"}
                    </h1>

                    {pot && (
                        <div className="flex items-center gap-3">

                            {/* SHARE BUTTON */}
                            <PotShareButton pot={pot} />

                            {/* JOIN BUTTON */}
                            <Link href={`/pots/${pot.id}`}>
                                <button
                                    className={`px-5 py-2.5 rounded-xl shadow transition font-medium
                        ${isJoined || pot.status !== "open"
                                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                        : "bg-blue-600 text-white hover:bg-blue-500 active:scale-95"
                                    }`}
                                    disabled={isJoined || pot.status !== "open"}
                                >
                                    {isJoined ? "Déjà rejoint" : "Rejoindre"}
                                </button>
                            </Link>
                        </div>
                    )}
                </div>


                {/* MATCHS */}
                {loading ? (
                    <p className="text-center mt-10">Chargement...</p>
                ) : (
                    <div className="space-y-4">
                        {lines.map(line => (
                            <div
                                key={line.id}
                                className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition"
                            >
                                {/* ÉQUIPES */}
                                <div className="flex items-center gap-4">
                                    {/* HOME */}
                                    <div className={`flex items-center gap-2 p-2 rounded`}>
                                        <img src={line.team_home_logo} className="w-8 h-8 rounded-full" />
                                        <span>{line.team_home}</span>
                                        {line.score_home !== undefined && (
                                            <span className="ml-auto font-bold">{line.score_home}</span>
                                        )}
                                    </div>

                                    <span className="mx-2 font-bold">vs</span>

                                    {/* AWAY */}
                                    <div className={`flex items-center gap-2 p-2 rounded `}>
                                        <img src={line.team_away_logo} className="w-8 h-8 rounded-full" />
                                        <span>{line.team_away}</span>
                                        {line.score_away !== undefined && (
                                            <span className="ml-auto font-bold">{line.score_away}</span>
                                        )}
                                    </div>
                                </div>

                                {/* POINTS */}
{/*                                <div className="mt-3 font-semibold text-gray-700 dark:text-gray-200">
                                    Points : {line.points ?? 0}
                                </div>*/}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ---------------- COLONNE CLASSEMENT ---------------- */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-blue-600">Classement</h2>

                <section className="bg-white p-4 rounded-lg shadow-md h-max">
                    {loading ? (
                        <p className="text-center">Chargement...</p>
                    ) : (
                        <ul className="space-y-2">
                            {leaderboards.map((user, index) => (
                                <li
                                    key={user.user_id}
                                    className="flex items-center justify-between p-2 rounded hover:bg-blue-50 dark:hover:bg-gray-700 transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold w-6">{index + 1}</span>

                                        {user.avatar && (
                                            <img
                                                src={user.avatar}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        )}

                                        <span className="font-medium">{user.name}</span>
                                    </div>

                                    <span className="font-semibold">
                                        {user.points} pts
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>

        </div>
    );
}

