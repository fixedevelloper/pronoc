'use client';

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import axiosServices from "../../utils/axiosServices";
import { Pot, LinePotFoot } from "../../types/types";

type JoinPotPageProps = {
    params: string;
};

export default function JoinPotPage({ params }: JoinPotPageProps) {
    const { data: session } = useSession();
    const router = useRouter();

    const [pot, setPot] = useState<Pot | null>(null);
    const [lines, setLines] = useState<LinePotFoot[]>([]);
    const [predictions, setPredictions] = useState<Record<number, '1v' | '2v' | 'x'>>({});
    const [loading, setLoading] = useState(false);

    const potId = params;

    useEffect(() => {
        const fetchPot = async () => {
            try {
                const res = await axiosServices.get(`/api/pots/${potId}`);
                setPot(res.data.pot);
                setLines(res.data.pot.foot_lines);
            } catch (err) {
                console.error("Erreur API:", err);
            }
        };
        fetchPot();
    }, [potId]);

    const handleChange = (lineId: number, value: '1v' | '2v' | 'x') => {
        setPredictions(prev => ({ ...prev, [lineId]: value }));
    };

    const handleSubmit = async () => {
        if (!session) {
            router.push("/auth/login");
            return;
        }

        const payload = {
            predictions: Object.entries(predictions).map(([line_id, prediction]) => ({
                line_id: Number(line_id),
                prediction,
            })),
            amount: pot?.entry_fee || 0
        };

        try {
            setLoading(true);
            await axiosServices.post(`/api/pots/${potId}/join`, payload);
            router.push("/pots");
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!pot) return <p>Chargement du pot...</p>;

    return (
        <div className="container mx-auto px-4 mt-4 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 text-primary">{pot.name}</h1>
            <p className="text-gray-500 text-theme">Frais d'entrée : {pot.entry_fee}€</p>

            <div className="space-y-4">
                {lines.map(line => {
                    const homeFav = line.fixture.favorite === 'home';
                    const awayFav = line.fixture.favorite === 'away';

                    return (
                        <div key={line.id} className="p-4 bg-card rounded-lg shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                            {/* Équipes avec logo, score et couleur favorite */}
                            <div className="flex items-center gap-4 w-full md:w-1/2">
                                <div className={`flex items-center gap-2 p-2 rounded ${homeFav ? 'bg-green-100 dark:bg-green-700' : ''}`}>
                                    <img src={line.fixture.team_home_logo} alt={line.fixture.team_home_name} className="w-8 h-8 object-contain rounded-full" />
                                    <span className="font-medium">{line.fixture.team_home_name}</span>
                                    {line.fixture.score_home !== undefined && (
                                        <span className="ml-auto font-bold">{line.fixture.score_home}</span>
                                    )}
                                </div>

                                <span className="mx-2 font-bold text-gray-500 dark:text-gray-400">vs</span>

                                <div className={`flex items-center gap-2 p-2 rounded ${awayFav ? 'bg-green-100 dark:bg-green-700' : ''}`}>
                                    <img src={line.fixture.team_away_logo} alt={line.fixture.team_away_name} className="w-8 h-8 object-contain rounded-full" />
                                    <span className="font-medium">{line.fixture.team_away_name}</span>
                                    {line.fixture.score_away !== undefined && (
                                        <span className="ml-auto font-bold">{line.fixture.score_away}</span>
                                    )}
                                </div>
                            </div>

                            {/* Boutons de prédiction */}
                            <div className="flex gap-3 mt-2 md:mt-0">
                                {['1v', '2v', 'x'].map(option => (
                                    <button
                                        key={option}
                                        className={`px-4 py-1 rounded border font-semibold transition ${
                                            predictions[line.id] === option
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                        onClick={() => handleChange(line.id, option as '1v' | '2v' | 'x')}
                                    >
                                        {option.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <button
                disabled={loading}
                onClick={handleSubmit}
                className="mt-6 w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-500 transition"
            >
                {loading ? "Validation..." : "Valider"}
            </button>
        </div>
    );
}
