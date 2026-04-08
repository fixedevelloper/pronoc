'use client'

import React, { useState, useEffect } from 'react'
import {
    Users,
    CreditCard,
    TrendingUp,
    Activity,
    Calendar,
    Smartphone,
    Award,
    BarChart3,
    PieChart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Stats {
    totalUsers: number
    activeUsers: number
    totalRevenue: number
    todayTransactions: number
    totalPredictions: number
    winRate: number
    momoTransactions: number
}

export default function AdminStatPage() {
    const [stats, setStats] = useState<Stats>({
        totalUsers: 0,
        activeUsers: 0,
        totalRevenue: 0,
        todayTransactions: 0,
        totalPredictions: 0,
        winRate: 0,
        momoTransactions: 0
    })
    const [loading, setLoading] = useState(true)

    // Mock stats Cameroon - remplacez par API
    useEffect(() => {
        const mockStats: Stats = {
            totalUsers: 1247,
            activeUsers: 892,
            totalRevenue: 45875000, // 45M XAF
            todayTransactions: 156,
            totalPredictions: 23456,
            winRate: 67.8,
            momoTransactions: 142
        }
        setStats(mockStats)
        setLoading(false)
    }, [])

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR').format(amount) + ' XAF'
    }

    const StatsCard = ({
                           title,
                           value,
                           change,
                           icon: Icon,
                           color = 'emerald',
                           className = ''
                       }: {
        title: string
        value: string | number
        change?: number
        icon: any
        color?: string
        className?: string
    }) => (
        <Card className={`border-0 shadow-2xl hover:shadow-emerald-500/50 transition-all ${className}`}>
            <CardContent className="p-8 lg:p-10">
                <div className="flex items-center justify-between mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-2xl flex items-center justify-center shadow-2xl`}>
                        <Icon className="w-8 h-8 text-white" />
                    </div>
                    {change !== undefined && (
                        <Badge className={`text-lg px-4 py-2 font-bold ${
                            change >= 0
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-red-100 text-red-800 border-red-300'
                        }`}>
                            {change >= 0 ? `+${change}%` : `${change}%`}
                        </Badge>
                    )}
                </div>
                <div>
                    <p className="text-2xl lg:text-3xl font-black text-slate-900 mb-2 leading-tight">{value}</p>
                    <p className="text-xl text-muted-foreground font-semibold">{title}</p>
                </div>
            </CardContent>
        </Card>
    )

    return (
        <div className="p-6 lg:p-12 space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <Card className="border-0 shadow-2xl">
                <CardHeader className="p-8 lg:p-12 bg-gradient-to-r from-slate-50 via-emerald-50 to-blue-50">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 via-teal-600 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl">
                            <BarChart3 className="w-12 h-12 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-4xl lg:text-5xl font-black text-slate-900 mb-2">
                                Tableau de Bord
                            </CardTitle>
                            <p className="text-xl text-muted-foreground">
                                Statistiques en temps réel • 28 Mars 2026
                            </p>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Stats Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <StatsCard
                    title="Utilisateurs"
                    value={stats.totalUsers.toLocaleString()}
                    change={12.5}
                    icon={Users}
                    color="emerald"
                />
                <StatsCard
                    title="Actifs 24h"
                    value={stats.activeUsers.toLocaleString()}
                    change={8.2}
                    icon={Activity}
                    color="blue"
                />
                <StatsCard
                    title="Chiffre d'Affaires"
                    value={formatCurrency(stats.totalRevenue)}
                    change={25.3}
                    icon={CreditCard}
                    color="teal"
                />
                <StatsCard
                    title="Taux Réussite"
                    value={`${stats.winRate}%`}
                    change={3.1}
                    icon={Award}
                    color="gold"
                    className="bg-gradient-to-br from-yellow-50 to-orange-50"
                />
                <StatsCard
                    title="Transactions Aujourd'hui"
                    value={stats.todayTransactions}
                    change={-2.1}
                    icon={TrendingUp}
                    color="purple"
                />
                <StatsCard
                    title="Prédictions Totales"
                    value={stats.totalPredictions.toLocaleString()}
                    change={18.7}
                    icon={Calendar}
                    color="indigo"
                />
                <StatsCard
                    title="MTN MoMo"
                    value={stats.momoTransactions}
                    change={32.4}
                    icon={Smartphone}
                    color="emerald"
                    className="ring-4 ring-emerald-100/50"
                />
                <StatsCard
                    title="Revenus Moyens/Jour"
                    value={formatCurrency(Math.floor(stats.totalRevenue / 90))}
                    change={22.8}
                    icon={TrendingUp}
                    color="green"
                />
            </div>

            {/* Graphiques & Tableaux */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenus par Jour */}
                <Card className="border-0 shadow-2xl">
                    <CardHeader className="p-8">
                        <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
                            <TrendingUp className="w-8 h-8" />
                            Revenus 7 derniers jours
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="h-80 bg-gradient-to-r from-slate-50 to-emerald-50 rounded-3xl flex items-center justify-center">
                            <div className="text-center text-muted-foreground">
                                <PieChart className="w-24 h-24 mx-auto mb-6 opacity-50" />
                                <p className="text-2xl font-black">Graphique Revenus</p>
                                <p className="text-lg">MTN MoMo: 89% • Bank: 11%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Utilisateurs */}
                <Card className="border-0 shadow-2xl">
                    <CardHeader className="p-8">
                        <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
                            <Users className="w-8 h-8" />
                            Top 10 Prédicteurs
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b-2 border-slate-200">
                                    <TableHead className="font-black text-lg">Rang</TableHead>
                                    <TableHead className="font-black text-lg">Utilisateur</TableHead>
                                    <TableHead className="font-black text-lg text-right">Prédictions</TableHead>
                                    <TableHead className="font-black text-lg text-right">Taux</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[
                                    { name: 'Julio Mbah', predictions: 156, rate: '78%' },
                                    { name: 'Jean Dupont', predictions: 134, rate: '72%' },
                                    { name: 'Marie K', predictions: 109, rate: '69%' },
                                    { name: 'Paul N', predictions: 98, rate: '65%' },
                                    { name: 'Sara M', predictions: 87, rate: '62%' },
                                ].map((user, index) => (
                                    <TableRow key={index} className="hover:bg-emerald-50/50 border-b border-slate-100 h-14">
                                        <TableCell className="font-black text-2xl text-emerald-600">{index + 1}</TableCell>
                                        <TableCell className="font-semibold text-xl">{user.name}</TableCell>
                                        <TableCell className="text-right font-bold text-2xl text-emerald-700">
                                            {user.predictions}
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-xl text-emerald-600 bg-emerald-100 px-4 py-2 rounded-xl">
                                            {user.rate}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Métriques Secondaires */}
            <Card className="border-0 shadow-2xl">
                <CardContent className="p-8 lg:p-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center p-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl">
                            <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                                <Smartphone className="w-10 h-10 text-white" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-4xl font-black text-emerald-800">{stats.momoTransactions}</p>
                                <p className="text-xl text-emerald-700 font-semibold">Transactions MTN MoMo</p>
                                <p className="text-2xl font-black text-emerald-600">89% du total</p>
                            </div>
                        </div>
                        <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl">
                            <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                                <Activity className="w-10 h-10 text-white" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-4xl font-black text-blue-800">3.2s</p>
                                <p className="text-xl text-blue-700 font-semibold">Temps de charge moyen</p>
                                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 ml-auto">A+</Badge>
                            </div>
                        </div>
                        <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-violet-50 rounded-3xl">
                            <div className="w-20 h-20 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                                <Users className="w-10 h-10 text-white" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-4xl font-black text-purple-800">24.7%</p>
                                <p className="text-xl text-purple-700 font-semibold">Nouveaux utilisateurs</p>
                            </div>
                        </div>
                        <div className="text-center p-8 bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl">
                            <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                                <Calendar className="w-10 h-10 text-white" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-4xl font-black text-orange-800">156</p>
                                <p className="text-xl text-orange-700 font-semibold">Matchs du jour</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}