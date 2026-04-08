'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Trophy, Calendar, Target, Zap, TrendingUp, BarChart3, Shield, Award, Star, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {AiPredictionResource} from "../../../../../types/AiPredictionResource";
import axiosServices from "../../../../../utils/axiosServices";
import {cn} from "../../../../../utils/utils";
import AccountBalance from "../../../../../../components/layout/AccountBalance";
import AccountNavigation from "../../../../../../components/layout/AccountNavigation";
import {useSession} from "next-auth/react";


export default function HistoryDetailPage() {
    const { data: session, status: statut } = useSession();
    const router = useRouter();
    const { id: predictionId } = useParams();
    const [prono, setProno] = useState<AiPredictionResource | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [balance, setBalance] = useState(0);
    useEffect(() => {
        if (predictionId && typeof predictionId === "string") {
            fetchPrediction(predictionId);
        }
    }, [predictionId]);
    const fetchPrediction = async (id: string) => {
        try {
            setLoading(true); setError(null);
            const res = await axiosServices.get(`/api/predictions/${id}`);
            setProno(res.data.data);
        } catch { setError('Erreur de chargement du pronostic'); }
        finally { setLoading(false); }
    };

    if (loading) return <Loader />;
    if (error || !prono) return <ErrorCard router={router} />;

    const { fixture, details, stats, confidence = 0 } = prono;
    const isWon = stats?.is_1x2_correct;
    const status = fixture?.st_short;
    useEffect(() => {
        if (statut === "unauthenticated") {
            router.push("/auth/login");
        } else if (status === "authenticated" && session?.user?.balance) {
            setBalance(Number(session.user.balance));
        }
    }, [statut, session, router]);
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20 py-8 lg:py-16">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10">
                {/* SIDEBAR */}
                <div className="lg:col-span-1 space-y-8 sticky top-8 lg:top-28 self-start pt-4 lg:pt-0 max-h-screen lg:max-h-fit">
                    <AccountBalance/>
                    <AccountNavigation />
                </div>
            <div className="lg:col-span-3 container mx-auto px-4 lg:px-8 max-w-6xl">
                <Header fixture={fixture} prono={prono} router={router} status={status} confidence={confidence} isWon={isWon} />

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12">
                    <ScorePredictionCard prono={prono} fixture={fixture} status={status} isWon={isWon} />
                    <ConfidenceCard prono={prono} confidence={confidence} />
                    {details && <>
                        <ProbabilitiesCard details={details} />
                        <OverUnderCard details={details} />
                        <BttsCard details={details} />
                        <AnalysisCard prono={prono} />
                    </>}
                </div>
            </div>
            </div>
        </div>
    );
}

/* ---------------- Components ---------------- */

const Loader = () => (
    <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
            <div className="w-24 h-24 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-8" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Chargement du détail...</h2>
            <p className="text-slate-600">Analyse IA complète</p>
        </div>
    </div>
);

const ErrorCard = ({ router }: { router: any }) => (
    <div className="min-h-screen flex items-center justify-center p-8">
        <Card className="max-w-md w-full border-0 shadow-2xl">
            <CardContent className="p-12 text-center">
                <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-red-800 mb-4">Pronostic introuvable</h2>
                <Button onClick={() => router.back()} className="w-full">← Retour aux pronostics</Button>
            </CardContent>
        </Card>
    </div>
);

const Header = ({ fixture, prono, router, status, confidence, isWon }: any) => (
    <div className="text-center mb-16 lg:mb-24">
        <Button variant="ghost" onClick={() => router.back()} className="mb-8 flex items-center gap-2 text-slate-600 hover:text-slate-900">← Retour</Button>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/50 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                <TeamInfo fixture={fixture} />
                <StatusConfidence status={status} confidence={confidence} isWon={isWon} />
            </div>
            <LeagueDate fixture={fixture} source={prono.source} />
        </div>
    </div>
);

const TeamInfo = ({ fixture }: any) => (
    <div className="flex items-center gap-4">
        <div className="flex -space-x-4">
            {[fixture?.home_team, fixture?.away_team].map((team: any, i: number) => (
                <div key={i} className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-1 shadow-xl border-4 border-white -ml-[1rem*(i>0?1:0)]">
                    <img src={team.logo || '/default-home.png'} alt={team.name} className="w-full h-full object-cover rounded-xl" />
                </div>
            ))}
        </div>
        <div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-2">{fixture?.home_team.name}</h1>
            <div className="flex items-center gap-2 text-2xl lg:text-3xl font-bold text-slate-600">
                <span>{fixture?.goal_home ?? '?'}</span>
                <span className="text-xl font-black text-slate-400 mx-2">—</span>
                <span>{fixture?.goal_away ?? '?'}</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900">{fixture?.away_team.name}</h2>
        </div>
    </div>
);

const StatusConfidence = ({ status, confidence, isWon }: any) => (
    <div className="flex flex-col items-center gap-4 lg:gap-6">
        <Badge className={cn(
            'text-2xl lg:text-3xl px-8 py-4 font-black shadow-2xl rounded-2xl',
            status === 'FT' ? (isWon ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white') :
                status === 'HT' ? 'bg-amber-500 text-white' :
                    status === 'NS' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'
        )}>{status}</Badge>

        <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl">
            <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full animate-pulse" />
            <div>
                <div className="text-sm font-bold text-slate-600 uppercase tracking-wider">Confiance IA</div>
                <div className="text-3xl lg:text-4xl font-black text-slate-900">{Math.round(confidence)}%</div>
            </div>
        </div>
    </div>
);

const LeagueDate = ({ fixture, source }: any) => (
    <div className="flex flex-wrap items-center justify-center gap-6 text-center lg:text-left">
        <div className="flex items-center gap-3 bg-slate-100/70 px-6 py-3 rounded-2xl backdrop-blur-sm">
            <Calendar className="w-5 h-5 text-slate-600" />
            <span className="font-bold text-slate-800">{new Date(fixture?.date).toLocaleDateString('fr-FR', { weekday:'long', year:'numeric', month:'long', day:'numeric'})}</span>
        </div>
        <div className="flex items-center gap-3 bg-emerald-100/70 px-6 py-3 rounded-2xl backdrop-blur-sm border border-emerald-200/50">
            <Trophy className="w-5 h-5 text-emerald-600" />
            <span className="font-bold text-emerald-800">{source}</span>
        </div>
    </div>
);

/* ---------------- Autres Cards ---------------- */

// Score prédiction
const ScorePredictionCard = ({ prono, fixture, status, isWon }: any) => (
    <Card className="lg:col-span-2 xl:col-span-2 border-0 shadow-2xl backdrop-blur-xl bg-gradient-to-br from-white/90 to-slate-50/70">
        <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl lg:text-3xl font-black">
                <Target className="w-8 h-8 text-blue-600" />
                Prédiction IA
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="text-center p-8 lg:p-12 bg-gradient-to-r from-blue-50/90 to-emerald-50/70 rounded-3xl backdrop-blur-xl border-2 border-blue-200/50 shadow-xl">
                <div className="text-6xl lg:text-7xl xl:text-8xl font-black text-slate-900 mb-6 drop-shadow-2xl">{prono.score_exact || 'À venir'}</div>
                <div className="text-xl uppercase tracking-widest text-slate-600 font-bold">Score exact prédit</div>
            </div>
        </CardContent>
    </Card>
);

// Confiance
const ConfidenceCard = ({ prono, confidence }: any) => (
    <Card className="border-0 shadow-2xl backdrop-blur-xl bg-gradient-to-br from-emerald-50/90 to-blue-50/70">
        <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
                <Zap className="w-6 h-6 text-emerald-600" />
                Confiance IA
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${confidence > 80 ? 'bg-emerald-500' : confidence > 60 ? 'bg-amber-500' : 'bg-orange-500'}`} />
                <span className="font-bold text-2xl lg:text-3xl text-slate-900">{Math.round(confidence)}%</span>
            </div>
            <Progress value={confidence} className="h-3 bg-slate-200/60 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-blue-500" />
        </CardContent>
    </Card>
);

// Probabilités
const ProbabilitiesCard = ({ details }: any) => (
    <Card className="border-0 shadow-2xl backdrop-blur-xl bg-gradient-to-br from-blue-50/90 to-slate-50/70">
        <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                1️⃣ X 2
            </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
            {[['Maison','home_win_prob','emerald'], ['Nul','draw_prob','slate'], ['Extérieur','away_win_prob','blue']].map(([label,key,color],i) => (
                <div key={i} className="text-center p-4 rounded-2xl bg-white/80 hover:shadow-md transition-all">
                    <div className="text-3xl lg:text-4xl font-black text-slate-900 mb-2">{Math.round(details[key as keyof typeof details] || 0)}%</div>
                    <div className={`text-xs uppercase font-bold text-${color}-700`}>{label}</div>
                </div>
            ))}
        </CardContent>
    </Card>
);

// Over/Under
const OverUnderCard = ({ details }: any) => (
    <Card className="border-0 shadow-2xl backdrop-blur-xl bg-gradient-to-br from-emerald-50/90 to-green-50/70">
        <CardHeader><CardTitle className="flex items-center gap-3 text-xl lg:text-2xl"><BarChart3 className="w-6 h-6 text-emerald-600"/>Over/Under</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
            {[['O',details.over_2_5,'emerald'],['U',details.under_2_5,'slate']].map(([label,val,color],i) => (
                <div key={i} className="p-6 text-center rounded-2xl bg-white/80 hover:shadow-md transition-all">
                    <div className={`text-4xl font-black text-${color}-600 mb-2`}>{val || 0}%</div>
                    <div className={`text-sm uppercase font-bold text-${color}-700 tracking-wider`}>{label} 2.5</div>
                </div>
            ))}
        </CardContent>
    </Card>
);

// BTTS
const BttsCard = ({ details }: any) => (
    <Card className="border-0 shadow-2xl backdrop-blur-xl bg-gradient-to-br from-purple-50/90 to-pink-50/70">
        <CardHeader><CardTitle className="flex items-center gap-3 text-xl lg:text-2xl"><Shield className="w-6 h-6 text-purple-600"/>BTTS</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-6">
            {[['OUI',details.btts_yes,'emerald'],['NON',details.btts_no,'slate']].map(([label,val,color],i) => (
                <div key={i} className={`p-6 text-center rounded-2xl ${val>50 ? `bg-gradient-to-br from-${color}-100/80 to-${color}-100/60 shadow-${color}-200/50 border-${color}-200/50`:'bg-white/80 shadow-slate-200/50'}`}>
                    <div className={`text-4xl font-black text-${color}-600 mb-2`}>{val||0}%</div>
                    <div className={`text-sm uppercase font-bold text-${color}-700 tracking-wider`}>{label}</div>
                </div>
            ))}
        </CardContent>
    </Card>
);

// Analyse
const AnalysisCard = ({ prono }: any) => (
    prono.raw_response?.analysis && (
        <Card className="xl:col-span-3 border-0 shadow-2xl backdrop-blur-xl bg-gradient-to-br from-slate-50/90 to-emerald-50/70">
            <CardHeader><CardTitle className="flex items-center gap-3 text-xl lg:text-2xl"><Award className="w-6 h-6 text-orange-600"/>Analyse IA Complète</CardTitle></CardHeader>
            <CardContent className="p-8 lg:p-12 prose prose-slate max-w-none">
                <p className="text-lg lg:text-xl leading-relaxed whitespace-pre-wrap">{prono.raw_response.analysis}</p>
                {prono.details?.best_bets?.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-slate-200/50">
                        <h4 className="flex items-center gap-3 mb-6 text-xl font-bold text-slate-900">
                            <Star className="w-6 h-6 text-amber-500"/>Meilleurs paris suggérés
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {prono.details.best_bets.map((bet:string,i:number)=><Badge key={i} className="px-6 py-4 text-lg font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-xl transition-all justify-center h-auto py-3">{bet}</Badge>)}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
);