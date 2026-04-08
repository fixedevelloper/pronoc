'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Users, DollarSign, TrendingUp, Award, FootprintsIcon, Zap, BarChart3,
    UserPlus, Shield, Download, Volleyball
} from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

// Données mock (remplacez par API)
const stats = [
    { title: "Joueurs Actifs", value: "1,247", change: "+12%", icon: Users, color: "emerald" },
    { title: "Pots Ouverts", value: "24", change: "+3", icon: Award, color: "blue" },
    { title: "Prize Pool", value: "2.5M XAF", change: "+18%", icon: DollarSign, color: "green" },
    { title: "Précision IA", value: "78.4%", change: "+2.1%", icon: Zap, color: "purple" },
];

const recentPots = [
    { id: "#POT001", match: "PSG vs Real Madrid", players: 128, pool: "250k XAF", status: "open" },
    { id: "#POT002", match: "Man Utd vs Liverpool", players: 89, pool: "180k XAF", status: "open" },
    { id: "#POT003", match: "Bayern vs Dortmund", players: 156, pool: "320k XAF", status: "closed" },
    { id: "#POT004", match: "Barça vs Atletico", players: 67, pool: "140k XAF", status: "open" },
];

const recentUsers = [
    { id: "#USR1247", name: "Julio Mbah", phone: "+23769123456", pots: 5, wins: 3 },
    { id: "#USR1246", name: "Sarah Kamga", phone: "+23769234567", pots: 12, wins: 8 },
    { id: "#USR1245", name: "Pierre Ngu", phone: "+23769345678", pots: 3, wins: 1 },
];

export default function AdminDashboardPage() {
    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-background">

            {/* Main Content */}
            <div className="flex-1 flex flex-col">

                {/* Header */}
                <header className="bg-card border-b shadow-sm px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-gray-900 to-emerald-600 bg-clip-text text-transparent">
                                Dashboard Admin
                            </h1>
                            <p className="text-muted-foreground text-sm sm:text-lg mt-1">Vue d'ensemble PronoCrew</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                            <Button variant="outline" size="sm">
                                <Download className="mr-2 h-4 w-4" />
                                Export CSV
                            </Button>
                            <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Nouvel Utilisateur
                            </Button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 overflow-auto">

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {stats.map((stat, index) => (
                            <Card key={index} className="group hover:shadow-xl transition-all border-0 overflow-hidden">
                                <CardHeader className="pb-2 sm:pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-3 rounded-2xl bg-${stat.color}-500/10 group-hover:bg-${stat.color}-500/20 transition-all`}>
                                            <stat.icon className={`h-6 w-6 sm:h-8 sm:w-8 text-${stat.color}-600`} />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl sm:text-3xl font-black">{stat.value}</CardTitle>
                                            <CardDescription>{stat.title}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className={`text-sm font-semibold text-${stat.color}-600 flex items-center gap-1`}>
                                        <TrendingUp className={`h-4 w-4 ${stat.change.startsWith('+') ? '' : 'rotate-180'}`} />
                                        {stat.change}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Charts + Tables */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

                        {/* Pots Récentes */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Volleyball className="h-5 w-5 sm:h-6 sm:w-6" />
                                    Pots Récentes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 sm:space-y-3">
                                    {recentPots.map((pot) => (
                                        <div key={pot.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-xl hover:bg-muted hover:shadow-sm transition-all">
                                            <div className="space-y-1">
                                                <h4 className="font-semibold text-base sm:text-lg">{pot.match}</h4>
                                                <p className="text-xs sm:text-sm text-muted-foreground">{pot.id}</p>
                                            </div>
                                            <div className="text-right mt-2 sm:mt-0">
                                                <div className="font-bold text-lg sm:text-xl">{pot.players}</div>
                                                <div className="text-xs sm:text-sm font-mono">{pot.pool}</div>
                                                <Badge variant={pot.status === 'open' ? "default" : "secondary"} className="mt-1">
                                                    {pot.status === 'open' ? 'Ouvert' : 'Fermé'}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Joueurs Récentes */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                                    Joueurs Actifs
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 sm:space-y-3">
                                    {recentUsers.map((user) => (
                                        <div key={user.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-xl hover:bg-muted hover:shadow-sm transition-all">
                                            <div>
                                                <h4 className="font-semibold">{user.name}</h4>
                                                <p className="text-xs sm:text-sm text-muted-foreground">{user.phone}</p>
                                            </div>
                                            <div className="text-right mt-2 sm:mt-0 flex items-center gap-2">
                                                <div className="font-bold">{user.pots}</div>
                                                <Badge className="bg-emerald-500 hover:bg-emerald-600">{user.wins}V</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </main>
            </div>
        </div>
    );
}