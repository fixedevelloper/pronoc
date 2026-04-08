'use client';
import {useState, useEffect} from 'react';
import {useSession} from 'next-auth/react';
import Link from 'next/link';
import {
    Wallet, ListChecks, Trophy, TrendingUp, Shield,
    Award, Star, Users, BarChart3, ArrowRight, RefreshCw
} from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Skeleton} from '@/components/ui/skeleton';
import axiosServices from "../../../../utils/axiosServices";

interface DashboardStats {
    balance: number;
    total_pots: number;
    total_points: number;
    total_pronostics: number;
    pronostics_won: number;
    accuracy_rate: number;
    total_gains: number;
    rank_position: number;
    vip_level: number;
}

export default function AccountDashboard() {
    const {data: session} = useSession();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ✅ Fetch simple
    const fetchStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axiosServices.get<DashboardStats>('api/dashboard/stats');
            setStats(res.data);
        } catch (err) {
            console.error('Stats error:', err);
            setError('Erreur de chargement des stats');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    // Refresh manuel
    const handleRefresh = () => {
        fetchStats();
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XAF',
            minimumFractionDigits: 0
        }).format(amount);

    const getVipBadge = (level: number = 0) => {
        const levels = [
            {label: 'Starter', color: 'slate'},
            {label: 'Bronze', color: 'amber'},
            {label: 'Silver', color: 'blue'},
            {label: 'Gold', color: 'yellow'},
            {label: 'Platinum', color: 'emerald'},
            {label: 'Diamond', color: 'purple'}
        ];
        return levels[Math.min(level, levels.length - 1)];
    };

    if (error) {
        return (
            <div className="mx-auto mt-10 px-4 max-w-6xl">
                <Card className="border-0 shadow-xl max-w-2xl mx-auto">
                    <CardContent className="p-12 text-center">
                        <Shield className="w-20 h-20 text-red-500 mx-auto mb-6"/>
                        <h2 className="text-2xl font-bold text-red-800 mb-4">Erreur</h2>
                        <p className="text-slate-600 mb-8">{error}</p>
                        <div className="flex gap-4">
                            <Button onClick={handleRefresh} variant="outline">
                                🔄 Réessayer
                            </Button>
                            <Button onClick={() => window.location.reload()}>
                                Recharger page
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="mx-auto mt-8 px-4 sm:px-6 lg:px-8 max-w-7xl space-y-10">

            {/* HEADER */}
            <div className="bg-gradient-to-r from-slate-50/90 to-blue-50/70 rounded-2xl p-6 lg:p-8 shadow-xl border border-slate-200/50">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                    <div>
                        <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-emerald-800 bg-clip-text text-transparent">
                            Dashboard {session?.user?.name}
                        </h1>
                        <p className="text-base text-slate-600">
                            Statistiques en temps réel
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleRefresh}
                            disabled={loading}
                            className="flex items-center gap-2"
                        >
                            {loading
                                ? <RefreshCw className="w-4 h-4 animate-spin"/>
                                : <ArrowRight className="w-4 h-4"/>
                            }
                            Refresh
                        </Button>

                        {stats && (
                            <Badge className="px-4 py-2 font-bold bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
                                VIP {getVipBadge(stats.vip_level).label}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

                {/* SOLDE */}
                <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-emerald-50">
                    <CardContent className="p-6 text-center">
                        <div className="text-sm text-slate-600 mb-2">Solde</div>

                        {loading ? (
                            <Skeleton className="h-10 w-32 mx-auto"/>
                        ) : (
                            <div className="text-3xl font-black text-slate-900">
                                {formatCurrency(stats?.balance || 0)}
                            </div>
                        )}

                        <Link href="/deposit" className="mt-4 block text-sm font-bold text-blue-600">
                            + Déposer
                        </Link>
                    </CardContent>
                </Card>

                {/* POTS */}
                <Card className="shadow-lg border bg-emerald-50">
                    <CardContent className="p-6 text-center">
                        <div className="text-sm text-slate-600 mb-2">Pots</div>
                        <div className="text-3xl font-black text-emerald-700">
                            {stats?.total_pots || 0}
                        </div>
                    </CardContent>
                </Card>

                {/* POINTS */}
                <Card className="shadow-lg border bg-yellow-50">
                    <CardContent className="p-6 text-center">
                        <div className="text-sm text-slate-600 mb-2">Points</div>
                        <div className="text-3xl font-black text-amber-600">
                            {stats?.total_points || 0}
                        </div>
                    </CardContent>
                </Card>

                {/* PRONOS */}
                <Card className="shadow-lg border bg-slate-50">
                    <CardContent className="p-6 text-center">
                        <div className="text-sm text-slate-600 mb-2">Pronostics</div>

                        <div className="flex justify-center gap-6">
                            <div>
                                <div className="text-2xl font-black">
                                    {stats?.total_pronostics || 0}
                                </div>
                                <div className="text-xs text-slate-500">Total</div>
                            </div>

                            <div>
                                <div className="text-2xl font-black text-emerald-600">
                                    {stats?.pronostics_won || 0}
                                </div>
                                <div className="text-xs text-emerald-600">Gagnés</div>
                            </div>
                        </div>

                        <div className="mt-4 text-sm font-bold text-slate-700">
                            Accuracy: {stats?.accuracy_rate || 0}%
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* DETAILS */}
            {!loading && stats && (
                <Card className="shadow-xl border-0 bg-white rounded-2xl">
                    <CardContent className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">

                        <div className="text-center">
                            <div className="text-sm text-slate-500">Gains</div>
                            <div className="text-2xl font-black text-emerald-600">
                                {formatCurrency(stats.total_gains)}
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="text-sm text-slate-500">Classement</div>
                            <div className="text-2xl font-black text-blue-600">
                                #{stats.rank_position || 0}
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="text-sm text-slate-500">VIP</div>
                            <div className="text-2xl font-black text-purple-600">
                                {stats.vip_level}
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="text-sm text-slate-500">Activité</div>
                            <div className="text-2xl font-black text-slate-700">
                                {stats.total_pots}
                            </div>
                        </div>

                    </CardContent>
                </Card>
            )}

        </div>
    );
}



