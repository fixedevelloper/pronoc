"use client";
import { useState, useEffect, useRef } from "react";
import axiosServices from "../../../../utils/axiosServices";
import AccountBalance from "../../../../components/layout/AccountBalance";
import AccountNavigation from "../../../../components/layout/AccountNavigation";

export default function CreatePotPage() {
    const [step, setStep] = useState(1);
    const [potName, setPotName] = useState("");
    const [potAmount, setPotAmount] = useState("");
    const [selectedFixtures, setSelectedFixtures] = useState<number[]>([]);
    const [fixtures, setFixtures] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const observer = useRef<IntersectionObserver | null>(null);
    const lastFixtureRef = useRef<HTMLDivElement | null>(null);

    /** Load fixtures with pagination */
    const loadFixtures = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await axiosServices.get(`/api/fixtures?page=${page}`);
            const newFixtures = res.data.data || [];
            setFixtures(prev => [...prev, ...newFixtures]);
            if (newFixtures.length > 0) setPage(prev => prev + 1);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    /** Infinite scroll observer */
/*    useEffect(() => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !loading) loadFixtures();
        });
        if (lastFixtureRef.current) observer.current.observe(lastFixtureRef.current);
        return () => observer.current?.disconnect();
    }, [lastFixtureRef.current, loading]);*/

    useEffect(() => { loadFixtures(); }, []);

    /** Toggle fixture selection */
    const toggleFixture1 = (id: number) => {
        setSelectedFixtures(prev => {
            const selected = new Set(prev);
            if (selected.has(id)) {
                selected.delete(id);
            } else {
                selected.add(id);
            }
            return Array.from(selected);
        });
    };
    const toggleFixture = (id: number) => {
        setSelectedFixtures(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };
    /** Submit pot */
    const createPot = async () => {
        try {
            const payload = { name: potName,entry_fee:potAmount, fixtures: selectedFixtures };
            await axiosServices.post("/api/pots", payload);

        } catch (e) {
            console.error(e);
        }
    };

    /** Filtered fixtures by search */
    const filteredFixtures = fixtures.filter(f =>
        f.team_home.toLowerCase().includes(search.toLowerCase()) ||
        f.team_away.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-8xl mx-auto mt-8 px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* ---------------- SIDEBAR ---------------- */}
            <div className="md:col-span-1 space-y-6">
                <AccountBalance />

                {/* Navigation */}
                <AccountNavigation />
            </div>

            <div className="md:col-span-2">
            <h1 className="text-3xl font-bold text-blue-600 text-left">Créer un Pot</h1>

            {/* Stepper */}
            <div className="flex items-start justify-center gap-4 mb-6">
                <div className={`px-4 py-2 rounded-full font-semibold text-sm transition 
                    ${step === 1 ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"}`}>
                    Étape 1 : Infos du pot
                </div>
                <div className={`px-4 py-2 rounded-full font-semibold text-sm transition 
                    ${step === 2 ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"}`}>
                    Étape 2 : Choix des matchs
                </div>
            </div>

            {/* Step 1 */}
            {step === 1 && (
                <div className="bg-card p-6 rounded-lg shadow space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nom du Pot</label>
                        <input
                            type="text"
                            value={potName}
                            onChange={e => setPotName(e.target.value)}
                            placeholder="Ex: Pot Ligue des Champions"
                            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                             input-theme"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Montant a miser</label>
                        <input
                            type="text"
                            value={potAmount}
                            onChange={e => setPotAmount(e.target.value)}
                            placeholder="Ex: Pot Ligue des Champions"
                            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2
                             focus:outline-none focus:ring-2 focus:ring-blue-500 input-theme"
                        />
                    </div>
                    <button
                        disabled={!potName}
                        onClick={() => setStep(2)}
                        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition disabled:opacity-50"
                    >
                        Suivant →
                    </button>
                </div>
            )}

            {/* Step 2 */}
            {/* ----------- STEP 2 : Sélection des matchs ----------- */}
            {step === 2 && (
                <div className="space-y-6">

                    <h2 className="text-xl font-semibold text-gray-800 text-accent">Sélectionnez les matchs</h2>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto">
                        {fixtures.map((match, index) => {
                            const isSelected = selectedFixtures.includes(match.id);
                            const isLast = index === fixtures.length - 1;

                            return (
                                <div
                                    key={match.id}
                                    ref={isLast ? lastFixtureRef : null}
                                    className={`flex items-center justify-between p-4 rounded-lg shadow-sm transition
                            ${isSelected ? "bg-blue-50 dark:bg-blue-900 border-2 border-blue-500" : "bg-card"}
                        `}
                                >
                                    {/* Infos du match */}
                                    <div className="flex items-center gap-3">
                                        <img src={match.team_home_logo} alt={match.team_home} className="w-8 h-8 rounded-full object-cover" />
                                        <span className="font-medium text-gray-800 text-theme">{match.team_home}</span>
                                        <span className="mx-2 text-gray-400 text-theme">vs</span>
                                        <img src={match.team_away_logo} alt={match.team_away} className="w-8 h-8 rounded-full object-cover" />
                                        <span className="font-medium text-gray-800 text-theme">{match.team_away}</span>
                                    </div>

                                    {/* Checkbox */}
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleFixture(match.id)}
                                        className="w-5 h-5 accent-blue-600 cursor-pointer"
                                    />
                                </div>
                            );
                        })}

                        {loading && (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-2">Chargement...</p>
                        )}

                        <div ref={lastFixtureRef}></div>
                    </div>

                    {/* Boutons navigation */}
                    <div className="flex justify-between mt-6">
                        <button
                            onClick={() => setStep(1)}
                            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        >
                            ← Retour
                        </button>

                        <button
                            onClick={createPot}
                            disabled={selectedFixtures.length === 0}
                            className={`px-4 py-2 rounded text-white transition
                    ${selectedFixtures.length === 0 ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"}`}
                        >
                            Créer le pot
                        </button>
                    </div>
                </div>
            )}

        </div>
        </div>
    );
}
