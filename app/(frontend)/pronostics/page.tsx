'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
    Calendar, Clock, Target, Trophy, ChevronRight,
    Zap, RefreshCw, Search, Play, Pause, CheckCircle2, AlertCircle
} from 'lucide-react';

import {
    Card, CardContent, CardHeader, CardTitle, CardDescription
} from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

import axiosServices from '../../utils/axiosServices';
import { cn } from "../../utils/utils";
import {AiPredictionResource} from "../../types/AiPredictionResource";

export default function PronosticDayPage() {
    const today = new Date().toISOString().split('T')[0];

    const [pronostics, setPronostics] = useState<AiPredictionResource[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState(today);

    // ✅ Format date optimisé (mémo)
    const formatDate = useCallback((date: string) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }, []);

    // ✅ Fetch générique
    const fetchPronostics = useCallback(async (date?: string) => {
        setLoading(true);
        setError(null);

        try {
            const url = date
                ? `/api/predictions?date=${date}`
                : '/api/predictions';

            const res = await axiosServices.get(url);
            setPronostics(res.data.data || []);
        } catch (err: any) {
            console.error(err);
            setError(err?.message || 'Erreur de chargement');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPronostics();
    }, [fetchPronostics]);

    // ✅ Stats memo (perf++)
    const { totalWon, totalPronos, accuracy } = useMemo(() => {
        const total = pronostics.length;
        const won = pronostics.filter(p => p?.stats?.is_1x2_correct).length;

        return {
            totalPronos: total,
            totalWon: won,
            accuracy: total > 0 ? Math.round((won / total) * 100) : 0
        };
    }, [pronostics]);

    // ✅ Groupement optimisé
    const pronosByStatus = useMemo(() => ({
        upcoming: pronostics.filter(p => p?.fixture?.st_short === 'NS'),
        halftime: pronostics.filter(p => p?.fixture?.st_short === 'HT'),
        fulltime: pronostics.filter(p => p?.fixture?.st_short === 'FT'),
        live: pronostics.filter(p =>
            !['NS', 'HT', 'FT'].includes(p?.fixture?.st_short || '')
        ),
    }), [pronostics]);

    // ================= UI STATES =================

    if (loading) {
        return (
            <LoadingScreen />
        );
    }

    if (error) {
        return (
            <ErrorScreen error={error} retry={() => fetchPronostics()} />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-emerald-50/30 py-8 lg:py-16">
            <div className="container mx-auto px-4 lg:px-8 max-w-7xl">

                {/* HEADER */}
                <Header
                    selectedDate={selectedDate}
                    today={today}
                    formatDate={formatDate}
                    setSelectedDate={setSelectedDate}
                    fetchPronostics={fetchPronostics}
                    loading={loading}
                    total={totalPronos}
                />

                {/* STATS */}
                <Stats total={totalPronos} won={totalWon} accuracy={accuracy} />

                {/* SECTIONS */}
                <Sections pronosByStatus={pronosByStatus} totalWon={totalWon} />
            </div>
        </div>
    );
}
type SectionsProps = {
    pronosByStatus: Record<string, any>; // à améliorer selon ton modèle
    totalWon: number;
};
function Sections({ pronosByStatus, totalWon }: SectionsProps) {
    return (
        <div className="space-y-16">
            <Section title="À Venir" data={pronosByStatus.upcoming} />
            <Section title="Mi-temps" data={pronosByStatus.halftime} />
            <Section title="Live" data={pronosByStatus.live} />
            <Section
                title={`Résultats (${totalWon} gagnés)`}
                data={pronosByStatus.fulltime}
            />
        </div>
    );
}
interface PronosticCardProps {
    prono: any;
}

function PronosticCard({ prono }: PronosticCardProps) {
    const { fixture, details, stats, score_exact, confidence, predicted_at, source, id } = prono;

    const status = fixture?.st_short ?? 'NS';
    const isFinished = status === 'FT';
    const isWon = !!stats?.is_1x2_correct;

    // ✅ Score affiché
    const score = score_exact ||
        `${fixture?.goal_home ?? '?'} - ${fixture?.goal_away ?? '?'}`;

    // ✅ Couleur statut
    const statusConfig = (() => {
        switch (status) {
            case 'FT':
                return {
                    className: isWon ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white',
                    icon: isWon ? <CheckCircle2 className="w-4 h-4" /> : <Trophy className="w-4 h-4" />
                };
            case 'HT':
                return { className: 'bg-amber-500 text-white', icon: <Pause className="w-4 h-4" /> };
            case 'NS':
                return { className: 'bg-blue-500 text-white', icon: <Calendar className="w-4 h-4" /> };
            default:
                return { className: 'bg-red-500 text-white', icon: <Play className="w-4 h-4" /> };
        }
    })();

    // ✅ Couleur confiance
    const confidenceClass =
        confidence > 80
            ? 'text-emerald-700 bg-emerald-100/80'
            : confidence > 60
            ? 'text-amber-700 bg-amber-100/80'
            : 'text-orange-700 bg-orange-100/80';

    return (
        <Link href={`/pronostics/${id}`} className="group block h-full">
            <Card className="h-full bg-white/80 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border hover:border-blue-200/50">

                {/* HEADER */}
                <CardHeader className="p-6 pb-4 relative">

                    {/* Status */}
                    <div className="absolute top-4 right-4">
                        <Badge className={cn("font-bold px-3 py-1.5 shadow-lg", statusConfig.className)}>
                            {statusConfig.icon}
                            <span className="ml-1 uppercase">{status}</span>
                        </Badge>
                    </div>

                    {/* Confidence */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                        <div className={cn("px-3 py-1.5 rounded-full text-xs font-bold", confidenceClass)}>
                            {Math.round(confidence || 0)}%
                        </div>

                        {details?.odds_home && (
                            <Badge variant="outline" className="text-xs">
                                @{details.odds_home.toFixed(2)}
                            </Badge>
                        )}
                    </div>

                    {/* Match */}
                    <CardTitle className="font-black text-lg lg:text-xl leading-tight mt-6 group-hover:text-blue-600 transition-colors">
                        {fixture?.team_home_name}
                        <span className="text-slate-400 mx-2 font-normal">vs</span>
                        {fixture?.team_away_name}
                    </CardTitle>

                    <CardDescription className="flex items-center gap-2 text-sm text-slate-600">
                        <Target className="w-4 h-4" />
                        {status} • {source}
                    </CardDescription>

                    {/* Date */}
                    {fixture?.date && (
                        <div className="text-xs bg-slate-100/70 px-3 py-1.5 rounded-full w-fit mt-2">
                            {new Date(fixture.date).toLocaleDateString('fr-FR', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short'
                            })}
                        </div>
                    )}
                </CardHeader>

                {/* CONTENT */}
                <CardContent className="p-6 pt-0">

                    {/* SCORE */}
                    <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-slate-50/90 to-blue-50/70 rounded-2xl mb-6">
                        <span className={cn(
                            "text-3xl font-black",
                            isFinished
                                ? isWon ? 'text-emerald-600' : 'text-slate-600'
                                : 'text-slate-500'
                        )}>
                            {score}
                        </span>

                        {!isFinished && score_exact && (
                            <Badge variant="secondary" className="text-xs">
                                Prédit: {score_exact}
                            </Badge>
                        )}
                    </div>

                    {/* INFOS */}
                    <div className="flex items-center justify-between text-xs text-slate-600 mb-4">
                        <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(predicted_at).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>

                        {stats?.accuracy_score && (
                            <div className="flex items-center gap-1 font-bold text-emerald-600">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {Math.round(stats.accuracy_score * 100)}%
                            </div>
                        )}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
                        <span className="text-xs uppercase font-bold text-slate-500 group-hover:text-blue-600 transition">
                            Détails IA
                        </span>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>

                </CardContent>
            </Card>
        </Link>
    );
}
type SectionProps = {
    title: string;
    data: any[]; // à améliorer
};
function Section({ title, data }: SectionProps) {
    if (!data.length) return null;

    return (
        <section>
            <h2 className="text-3xl font-black mb-6">{title}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.map(p => (
                    <PronosticCard key={p.id} prono={p} />
                ))}
            </div>
        </section>
    );

}
type StatsProps = {
    total: number;
    won: number;
    accuracy: number;
};
function Stats({ total, won, accuracy }: StatsProps) {
    return (
        <div className="grid grid-cols-3 gap-4 mb-12 text-center">
            <StatBox label="Total" value={total} />
            <StatBox label="Gagnés" value={won} success />
            <StatBox label="Taux" value={`${accuracy}%`} info />
        </div>
    );
}
type StatBoxProps = {
    label: string;
    value: string | number;
    success?: boolean;
    info?: boolean;
};
function StatBox({ label, value, success, info }:StatBoxProps) {
    return (
        <div className={cn(
            "p-6 rounded-2xl shadow-xl",
            success && "bg-emerald-50",
            info && "bg-blue-50",
            !success && !info && "bg-white"
        )}>
            <div className="text-3xl font-black">{value}</div>
            <div className="text-sm uppercase font-bold text-slate-600">{label}</div>
        </div>
    );
}

interface HeaderProps {
    selectedDate: string;
    today: string;
    formatDate: (date: string) => string;
    setSelectedDate: (date: string) => void;
    fetchPronostics: (date: string) => void;
    loading: boolean;
    total: number;
}

export function Header({
                                   selectedDate,
                                   today,
                                   formatDate,
                                   setSelectedDate,
                                   fetchPronostics,
                                   loading,
                                   total
                               }: HeaderProps) {

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        if (newDate <= today) {
            setSelectedDate(newDate);
        }
    };

    const handleTodayClick = () => {
        setSelectedDate(today);
        fetchPronostics(today);
    };

    const handleRefresh = () => {
        fetchPronostics(selectedDate);
    };

    return (
        <div className="bg-gradient-to-br from-white/90 via-blue-50/70 to-emerald-50/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 lg:p-12 mb-12 lg:mb-16 overflow-hidden">
            <div className="max-w-7xl mx-auto">

                {/* Header Row */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">

                    {/* Titre + Date */}
                    <div className="flex items-center gap-6 lg:gap-8">
                        {/* Icon */}
                        <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-500 via-emerald-500 to-green-500 rounded-3xl flex items-center justify-center shadow-2xl p-4 shrink-0">
                            <Calendar className="w-12 h-12 lg:w-14 lg:h-14 text-white drop-shadow-lg" />
                        </div>

                        {/* Titre */}
                        <div className="min-w-0 flex-1">
                            <h1 className="text-2xl lg:text-3xl xl:text-3xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-emerald-800 bg-clip-text text-transparent leading-tight line-clamp-1 mb-2">
                                Pronostics IA
                            </h1>
                            <p className="text-1xl lg:text-1xl font-bold text-slate-700/90">
                                {selectedDate === today ? "Aujourd'hui" : formatDate(selectedDate)}
                            </p>
                        </div>
                    </div>

                    {/* Actions + Stats */}
                    <div className="flex flex-wrap items-center gap-3 lg:gap-4 order-first lg:order-last justify-center lg:justify-end">

                        {/* Bouton Aujourd'hui */}
                        <Button
                            onClick={handleTodayClick}
                            size="sm"
                            className={cn(
                                "px-8 py-6 lg:py-7 h-auto text-lg font-bold shadow-lg hover:shadow-xl transition-all rounded-2xl flex items-center gap-3 group",
                                selectedDate === today
                                    ? "bg-gradient-to-r from-emerald-600 to-green-600 shadow-emerald-500/50 hover:from-emerald-700 hover:to-green-700"
                                    : "border-2 border-slate-200/50 hover:border-emerald-300 hover:shadow-emerald-200/50 bg-white/80 backdrop-blur-sm"
                            )}
                        >
                            <Zap className={cn("w-5 h-5 transition-transform",
                                selectedDate === today ? "group-hover:scale-110" : ""
                            )} />
                            Aujourd'hui
                        </Button>

                        {/* Sélecteur Date */}
                        <div className="flex items-center bg-white/90 backdrop-blur-sm shadow-lg border border-slate-200/50 rounded-2xl px-5 py-4 lg:px-8 lg:py-5 hover:shadow-xl transition-all overflow-hidden">
                            <Calendar className="w-6 h-6 text-slate-500 mr-3 lg:mr-4 flex-shrink-0" />
                            <Input
                                type="date"
                                value={selectedDate}
                                onChange={handleDateChange}
                                className="h-10 lg:h-14 w-72 lg:w-80 bg-transparent border-none p-0 text-xl lg:text-2xl font-bold text-slate-900 shadow-none ring-0 hover:bg-transparent focus:bg-transparent focus:ring-0 text-center"
                                //max={today}
                            />
                        </div>

                        {/* Bouton Recherche */}
                        <Button
                            onClick={handleRefresh}
                            size="sm"
                            disabled={loading}
                            className="px-8 py-6 lg:py-7 h-auto shadow-lg hover:shadow-xl transition-all rounded-2xl flex items-center gap-3 group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <RefreshCw className="w-5 h-5 animate-spin" />
                            ) : (
                                <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            )}
                            {loading ? "Chargement..." : "Actualiser"}
                        </Button>

                        {/* Badge Total */}
                        <Badge className="text-2xl lg:text-3xl px-8 py-6 lg:py-7 font-black shadow-2xl border-2 h-auto rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white border-emerald-600 shadow-emerald-500/50">
                            {total.toLocaleString()}
                        </Badge>
                    </div>
                </div>

                {/* Ligne Stats Optionnelle */}
                <div className="flex flex-col sm:flex-row gap-8 items-center justify-center pt-8 border-t border-slate-200/50">
                    <div className="text-center">
                        <div className="text-4xl font-black text-emerald-600 mb-1">⚡</div>
                        <p className="text-sm uppercase font-bold text-slate-600 tracking-wider">IA en temps réel</p>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-black text-blue-600 mb-1">🎯</div>
                        <p className="text-sm uppercase font-bold text-slate-600 tracking-wider">Précision 87%</p>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-black text-purple-600 mb-1">🏆</div>
                        <p className="text-sm uppercase font-bold text-slate-600 tracking-wider">Gains garantis</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
type ErrorScreenProps = {
    error: string;
    retry: () => void;
};
function ErrorScreen({ error, retry }: ErrorScreenProps) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="p-10 text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <p className="mb-6">{error}</p>
                <Button onClick={retry}>Réessayer</Button>
            </Card>
        </div>
    );
}
function LoadingScreen() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin h-16 w-16 border-b-2 border-blue-600 rounded-full" />
        </div>
    );
}