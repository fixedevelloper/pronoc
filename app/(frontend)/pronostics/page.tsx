'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Target, Trophy, Eye } from 'lucide-react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../components/ui/card";

interface Pronostic {
    id: number;
    match_id: number;
    home_team: string;
    away_team: string;
    home_score: number | null;
    away_score: number | null;
    prediction: string; // '1', 'X', '2', '1X', etc.
    confidence: number; // 0-100
    odds: number;
    match_date: string;
    league: string;
    status: 'live' | 'finished' | 'upcoming';
    is_won: boolean | null;
}

export default function PronosticDayPage() {
    const [pronostics, setPronostics] = useState<Pronostic[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPronosticsToday();
    }, []);

    const fetchPronosticsToday = async () => {
        try {
            setLoading(true);
            // API endpoint pour pronos du jour
            const response = await fetch('/api/pronostics/today');
            if (!response.ok) throw new Error('Erreur chargement');

            const data = await response.json();
            setPronostics(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                        <p className="mt-4 text-gray-500 dark:text-gray-400">Chargement des pronostics...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md mx-auto">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            ⚠️
                        </div>
                        <h2 className="text-2xl font-bold text-red-800 dark:text-red-300 mb-2">Erreur</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                        <button
                            onClick={fetchPronosticsToday}
                            className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                            Réessayer
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const pronosByStatus = {
        upcoming: pronostics.filter(p => p.status === 'upcoming'),
        live: pronostics.filter(p => p.status === 'live'),
        finished: pronostics.filter(p => p.status === 'finished'),
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 lg:py-12">
            <div className="container mx-auto px-4 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12 lg:mb-20">
                    <div className="inline-flex items-center gap-3 bg-white/60 dark:bg-gray-800/50 backdrop-blur-xl px-6 py-3 rounded-3xl shadow-xl mb-6">
                        <Calendar className="w-6 h-6 text-blue-600" />
                        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-400 bg-clip-text text-transparent">
                            Pronostics du Jour
                        </h1>
                    </div>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        {pronostics.length} pronostics pour aujourd'hui -
                        {pronostics.filter(p => p.is_won === true).length} gagnés confirmés
                    </p>
                </div>

                {/* Sections par statut */}
                <div className="space-y-8 lg:space-y-12">

                    {/* À venir */}
                    {pronosByStatus.upcoming.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">À venir</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {pronosByStatus.upcoming.map((prono) => (
                                    <PronosticCard key={prono.id} prono={prono} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Live */}
                    {pronosByStatus.live.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-3 h-3 bg-red-400 rounded-full animate-ping" />
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">EN COURS</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {pronosByStatus.live.map((prono) => (
                                    <PronosticCard key={prono.id} prono={prono} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Terminés */}
                    <section>
                        <div className="flex items-center gap-3 mb-8">
                            <Trophy className="w-8 h-8 text-green-500" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Terminés ({pronostics.filter(p => p.status === 'finished').length})
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {pronosByStatus.finished.map((prono) => (
                                <PronosticCard key={prono.id} prono={prono} />
                            ))}
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}

interface PronosticCardProps {
    prono: Pronostic;
}

function PronosticCard({ prono }: PronosticCardProps) {
    const score = `${prono.home_score ?? '?'} - ${prono.away_score ?? '?'}`;
    const isWon = prono.is_won === true;
    const confidenceColor = prono.confidence > 80 ? 'text-green-600' :
        prono.confidence > 60 ? 'text-yellow-600' : 'text-orange-600';

    return (
        <Link href={`/pronostics/${prono.id}`} className="group">
            <Card className="h-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden border-gray-100/50 dark:border-gray-700/50">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-bold ${confidenceColor} bg-opacity-10`}>
                            {prono.confidence}%
                        </div>
                        <div className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                            Cote {prono.odds?.toFixed(2) ?? '?'}
                        </div>
                        {prono.status === 'finished' && isWon && (
                            <div className="ml-auto">
                                <Trophy className="w-5 h-5 text-green-500 fill-green-100" />
                            </div>
                        )}
                    </div>
                    <CardTitle className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {prono.home_team} <span className="font-normal text-gray-400">vs</span> {prono.away_team}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            {prono.league}
                        </div>
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 pb-4">
                    <div className="flex items-center justify-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50/50 dark:from-gray-800/50 dark:to-blue-900/20 rounded-2xl mb-4">
                        <span className={`text-2xl lg:text-3xl font-black ${prono.status === 'finished' ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                            {score}
                        </span>
                        {prono.status !== 'finished' && (
                            <span className="text-sm font-semibold px-3 py-1 bg-white/60 dark:bg-gray-700/60 rounded-full">
                                {prono.prediction}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(prono.match_date).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center gap-1 group-hover:opacity-100 opacity-70 transition-opacity">
                            <Eye className="w-3 h-3" />
                            <span>Détails</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}