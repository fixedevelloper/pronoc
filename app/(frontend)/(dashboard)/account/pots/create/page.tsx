"use client";
import React, {useState, useEffect, useRef, useMemo, useCallback} from "react";
import axiosServices from "../../../../../utils/axiosServices";
import AccountBalance from "../../../../../../components/layout/AccountBalance";
import AccountNavigation from "../../../../../../components/layout/AccountNavigation";
import {useRouter} from "next/navigation";
import {useSnackbar} from "notistack";
import {FixtureCollection, MatchAnalysis} from "../../../../../types/types";
import {Badge} from "../../../../../../components/ui/badge";
import {Card, CardContent} from "../../../../../../components/ui/card";
import {Checkbox} from "../../../../../../components/ui/checkbox";
import {cn} from "../../../../../utils/utils";


export default function CreatePotPage() {

    const [step, setStep] = useState(1);
    const [potType, setPotType] = useState("");
    const [potName, setPotName] = useState("");
    const [potAmount, setPotAmount] = useState("");
    const [selectedFixtures, setSelectedFixtures] = useState<number[]>([]);
    const [selectedMatches, setSelectedMatches] = useState<Set<string>>(new Set())
    const [fixtures, setFixtures] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const observer = useRef<IntersectionObserver | null>(null);
    const lastFixtureRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const [searchTerm, setSearchTerm] = useState('')
    const [allFixtures, setAllFixtures] = useState<MatchAnalysis[]>([])
    const [hasMore, setHasMore] = useState(true)

    /** Load fixtures with pagination */
/*    const loadFixtures = async () => {
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
    };*/

    /** Infinite scroll observer */
/*    useEffect(() => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !loading) loadFixtures();
        });
        if (lastFixtureRef.current) observer.current.observe(lastFixtureRef.current);
        return () => observer.current?.disconnect();
    }, [lastFixtureRef.current, loading]);

    useEffect(() => { loadFixtures(); }, []);*/

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
    const toggle = (id: string) => {
        setSelectedMatches(prev => {
            const s = new Set(prev)
            s.has(id) ? s.delete(id) : s.add(id)
            return s
        })
    }
    /** Submit pot */
    const createPot = async () => {
        try {
            const matchIds = Array.from(selectedMatches)
            const payload = {type:potType, name: potName,entry_fee:potAmount, fixtures: matchIds };
            await axiosServices.post("/api/pots", payload);
            router.push("/account/pots");
            enqueueSnackbar('pot cre avec success', { variant: "success" });
        } catch (e) {
            enqueueSnackbar('une ereeur s est produite', { variant: "error" });
            console.error(e);
        }
    };

    /** Filtered fixtures by search */
/*    const filteredFixtures = fixtures.filter(f =>
        f?.team_home.toLowerCase().includes(search.toLowerCase()) ||
        f?.team_away.toLowerCase().includes(search.toLowerCase())
    );*/
    // 🔥 LOAD API
    const loadFixtures = useCallback(async () => {
        if (loading || !hasMore) return

        setLoading(true)

        try {
            const res = await axiosServices.get<FixtureCollection>(`/api/all-fixtures?page=${page}`)
            const data = res.data.data || []

            const formatted: MatchAnalysis[] = data.map(f => ({
                id: f.id.toString(),
                home_team: f.home_team.name,
                home_logo: f.home_team.logo,
                away_team: f.away_team.name,
                away_logo: f.away_team.logo,
                league: f.league?.name || 'Autres',
                league_logo: f.league?.logo || '',
                time: new Date(f.date).toLocaleTimeString('fr-FR', {
                    hour: '2-digit', minute: '2-digit'
                }),
                locked: !f.ai_prediction,
                price: 500
            }))

            setAllFixtures(prev => {
                const ids = new Set(prev.map(f => f.id))
                return [...prev, ...formatted.filter(f => !ids.has(f.id))]
            })

            setPage(p => p + 1)

            if (data.length < (res.data.meta.per_page || 20)) {
                setHasMore(false)
            }

        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [page, loading, hasMore])

    useEffect(() => { loadFixtures() }, [])

    // 🔥 OBSERVER FIX
    const lastRef = useCallback((node: HTMLDivElement | null) => {
        if (loading) return

        if (observer.current) observer.current.disconnect()

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadFixtures()
            }
        }, {
            rootMargin: '200px'
        })

        if (node) observer.current.observe(node)
    }, [loading, hasMore, loadFixtures])

    const filtered = useMemo(() => {
        if (!searchTerm) return allFixtures
        const t = searchTerm.toLowerCase()

        return allFixtures.filter(f =>
            f.home_team.toLowerCase().includes(t) ||
            f.away_team.toLowerCase().includes(t) ||
            f.league.toLowerCase().includes(t)
        )
    }, [searchTerm, allFixtures])
    const groupedMatches = useMemo(() => {
        const groups: Record<string, MatchAnalysis[]> = {}

        filtered.forEach(match => {
            const key = match.league || 'Autres'

            if (!groups[key]) {
                groups[key] = []
            }

            groups[key].push(match)
        })

        return Object.entries(groups)
    }, [filtered])

    const format = (n: number) =>
        new Intl.NumberFormat('fr-FR').format(n) + ' Tokens'

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
                        <label className="block text-sm font-medium mb-1">Montant a miser (FCFA)</label>
                        <input
                            type="text"
                            value={potAmount}
                            onChange={e => setPotAmount(e.target.value)}
                            placeholder="Ex: Pot Ligue des Champions"
                            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2
                             focus:outline-none focus:ring-2 focus:ring-blue-500 input-theme"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Type de Pot</label>
                        <select
                            value={potType}
                            onChange={e => setPotType(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                             input-theme">
                            <option>
                                Privee
                            </option>
                            <option>
                                Public
                            </option>
                        </select>
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
                      {/*  {fixtures.map((match, index) => {
                            const isSelected = selectedFixtures.includes(match.id);
                            const isLast = index === fixtures.length - 1;

                            return (
                                <div
                                    key={match.id}
                                    ref={isLast ? lastFixtureRef : null}
                                    className={`flex items-center justify-between p-4 rounded-lg shadow-sm transition
                            ${isSelected ? "bg-blue-500 text-white border-2 border-blue-500" : "bg-card"}
                        `}
                                >
                                     Infos du match
                                    <div className="flex items-center gap-3">
                                        <img src={match.team_home_logo} alt={match.team_home} className="w-8 h-8 rounded-full object-cover" />
                                        <span className="font-medium text-gray-800 text-theme">{match.team_home}</span>
                                        <span className="mx-2 text-gray-400 text-theme">vs</span>
                                        <img src={match.team_away_logo} alt={match.team_away} className="w-8 h-8 rounded-full object-cover" />
                                        <span className="font-medium text-gray-800 text-theme">{match.team_away}</span>
                                    </div>

                                     Checkbox
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleFixture(match.id)}
                                        className="w-5 h-5 accent-blue-600 cursor-pointer"
                                    />
                                </div>
                            );
                        })}*/}
                        {groupedMatches.map(([leagueName, matches], groupIndex) => (

                            <div key={leagueName} className="space-y-3">

                                {/* HEADER LIGUE */}
                                <div className="flex items-center justify-between px-2">

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                                            <img
                                                src={matches[0]?.league_logo}
                                                alt={leagueName}
                                                className="w-9 h-9 lg:w-10 lg:h-10 object-cover rounded-xl"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    (e.currentTarget.nextElementSibling as HTMLElement | null)?.style.setProperty('display', 'flex');
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <h2 className="font-black text-lg text-slate-900">
                                                {leagueName}
                                            </h2>
                                            <p className="text-xs text-slate-500">
                                                {matches.length} match{matches.length > 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>

                                    <Badge className="bg-blue-100 text-blue-700">
                                        {matches.length}
                                    </Badge>
                                </div>

                                {/* MATCHS */}
                                <div className="space-y-3">

                                    {matches.map((match, index) => {

                                        // 🔥 IMPORTANT: dernier élément GLOBAL
                                        const isLastGroup = groupIndex === groupedMatches.length - 1
                                        const isLastItem = index === matches.length - 1
                                        const isLast = isLastGroup && isLastItem

                                        return (
                                            <Card
                                                key={match.id}
                                                ref={isLast ? lastRef : null}
                                                className={cn(
                                                    "border-2 hover:shadow-xl transition",
                                                    selectedMatches.has(match.id)
                                                        ? "border-emerald-400 bg-emerald-50"
                                                        : "border-slate-200"
                                                )}
                                            >
                                                <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-center">

                                                    {/* Checkbox */}
                                                    <Checkbox
                                                        checked={selectedMatches.has(match.id)}
                                                        onCheckedChange={() => toggle(match.id)}
                                                    />

                                                    {/* Teams */}
                                                    <div className="flex items-center gap-2 flex-1">

                                                        <img
                                                            src={match.home_logo ?? "/default-logo.png"}
                                                            alt={match.home_team}
                                                        />
                                                        <span className="text-sm font-bold truncate">
                                        {match.home_team}
                                    </span>

                                                        <span className="text-xs">vs</span>

                                                        <img
                                                            src={match.away_logo ?? "/default-logo.png"}
                                                            alt={match.away_team}
                                                            className="w-8 h-8"
                                                        />
                                                        <span className="text-sm font-bold truncate">
                                        {match.away_team}
                                    </span>

                                                    </div>

                                                    {/* Infos */}
                                                    <div className="flex flex-col items-end text-xs">
                                                        <span>{match.time}</span>

                                                        {match.locked && (
                                                            <Badge>{format(match.price)}</Badge>
                                                        )}
                                                    </div>

                                                </CardContent>
                                            </Card>
                                        )
                                    })}

                                </div>
                            </div>
                        ))}
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
                            disabled={selectedMatches.size === 0}
                            className={`px-4 py-2 rounded text-white transition
                    ${selectedMatches.size === 0 ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"}`}
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
