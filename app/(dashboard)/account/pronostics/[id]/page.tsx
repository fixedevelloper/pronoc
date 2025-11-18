"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {useParams, useRouter} from "next/navigation";
import { LinePotFoot, Pot } from "../../../../types/types";
import axiosServices from "../../../../utils/axiosServices";
import AccountBalance from "../../../../components/layout/AccountBalance";
import AccountNavigation from "../../../../components/layout/AccountNavigation";

export default function MyPotsDetailPage() {
    const params = useParams();
    const id = params?.id as string;
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
                            const homeFav = line.team_home_fav === true;
                            const awayFav = line.team_away_fav === true;

                            return (
                                <div
                                    key={line.id}
                                    className="p-4 bg-card rounded-lg shadow-md flex flex-col gap-4 transition hover:shadow-lg"
                                >
                                    {/* TEAMS + SCORES */}
                                    <div className="flex items-center gap-4">

                                        {/* HOME TEAM */}
                                        <div
                                            className={`flex items-center gap-2 p-2 rounded w-full 
                    ${line.score_home > line.score_away ? "bg-green-100" :
                                                line.score_home < line.score_away ? "bg-red-100 " :
                                                    "bg-gray-100"}`}
                                        >
                                            <img src={line.team_home_logo} className="w-8 h-8 rounded-full" />
                                            <span>{line.team_home}</span>

                                            {/* SCORE HOME */}
                                            <span
                                                className="ml-auto font-bold px-2 py-1 rounded text-sm bg-white shadow"
                                            >
                    {line.score_home}
                </span>
                                        </div>

                                        <span className="mx-2 font-bold">vs</span>

                                        {/* AWAY TEAM */}
                                        <div
                                            className={`flex items-center gap-2 p-2 rounded w-full 
                    ${line.score_away > line.score_home ? "bg-green-100" :
                                                line.score_away < line.score_home ? "bg-red-100" :
                                                    "bg-gray-100"}`}
                                        >
                                            <img src={line.team_away_logo} className="w-8 h-8 rounded-full" />
                                            <span>{line.team_away}</span>

                                            {/* SCORE AWAY */}
                                            <span
                                                className="ml-auto font-bold px-2 py-1 rounded text-sm bg-white shadow"
                                            >
                    {line.score_away}
                </span>
                                        </div>
                                    </div>

                                    {/* PREDICTION */}
                                    <div className="font-semibold text-gray-700">
                                        Prediction : {line.prediction ?? ''}
                                    </div>
                                </div>
                            );

                        })
                    )}
                </div>

                {/* --------- COLONNE DROITE : CLASSEMENT --------- */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-blue-600 mb-4">Classement</h2>
                <section className="bg-white p-4 rounded-lg shadow-md h-max">


                    {loading ? (
                        <p className="text-center">Chargement...</p>
                    ) : (
                        <ul className="space-y-2">
                            {leaderboards.map((leaderboard, index) => (
                                <li
                                    key={leaderboard.user_id}
                                    className="flex items-center justify-between p-2 rounded hover:bg-blue-50 transition"
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

                                    <span className="font-semibold text-gray-700">
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
