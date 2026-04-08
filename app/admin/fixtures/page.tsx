'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
    Volleyball, Calendar, Clock, Edit3, Trash2, Plus, TrendingUp, ShieldCheck, Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data fixtures
const fixtures = [
    {
        id: 1,
        match: 'PSG vs Real Madrid',
        league: 'Ligue des Champions',
        date: '2026-04-02 20:00',
        status: 'pending' as const,
        odds: { home: 2.1, draw: 3.4, away: 3.2 },
        prediction: '2.1% PSG'
    },
    {
        id: 2,
        match: 'Man Utd vs Liverpool',
        league: 'Premier League',
        date: '2026-04-03 15:30',
        status: 'published' as const,
        odds: { home: 2.8, draw: 3.1, away: 2.4 },
        prediction: '3.2% Liverpool'
    },
    {
        id: 3,
        match: 'Bayern vs Dortmund',
        league: 'Bundesliga',
        date: '2026-04-04 18:00',
        status: 'live' as const,
        odds: { home: 1.5, draw: 4.0, away: 6.0 },
        prediction: '1.8% Bayern'
    },
];

const statusColors = {
    pending: 'orange' as const,
    published: 'emerald' as const,
    live: 'blue' as const,
    finished: 'gray' as const
} as const;

export default function AdminFixturePage() {
    const [editFixture, setEditFixture] = useState<any>(null);
    const [search, setSearch] = useState('');

    const filteredFixtures = fixtures.filter(fixture =>
        fixture.match.toLowerCase().includes(search.toLowerCase()) ||
        fixture.league.toLowerCase().includes(search.toLowerCase())
    );

    const stats = {
        total: fixtures.length,
        pending: fixtures.filter(f => f.status === 'pending').length,
        published: fixtures.filter(f => f.status === 'published').length,
        live: fixtures.filter(f => f.status === 'live').length
    };

    return (
        <div className="space-y-8">

            {/* Header + Stats */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-gray-900 to-emerald-600 bg-clip-text text-transparent">
                        <Volleyball className="inline w-12 h-12 mr-4 -mb-2" />
                        Gestion Fixtures
                    </h1>
                    <p className="text-xl text-muted-foreground mt-2">
                        {stats.total} fixtures | {stats.pending} en attente | {stats.live} live
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-80">
                        <Input
                            placeholder="Rechercher match ou ligue..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-12 pl-12 pr-4 rounded-2xl shadow-sm bg-background/80 backdrop-blur-sm"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    </div>
                    <Dialog>
                        <DialogTrigger>
                            <Button className="h-12 px-8 shadow-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 font-bold whitespace-nowrap">
                                <Plus className="w-5 h-5 mr-2" />
                                Nouvelle Fixture
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl rounded-3xl">
                            <DialogHeader>
                                <DialogTitle>Nouvelle Fixture</DialogTitle>
                                <DialogDescription>Configurez le match</DialogDescription>
                            </DialogHeader>
                            {/* Formulaire */}
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {Object.entries(stats).map(([key, value]) => (
                    <Card key={key} className="group hover:scale-105 transition-all border-0 shadow-lg hover:shadow-2xl">
                        <CardContent className="p-8 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 shadow-xl flex items-center justify-center">
                                <ShieldCheck className="w-8 h-8 text-white" />
                            </div>
                            <CardTitle className="text-3xl font-black text-emerald-600">{value}</CardTitle>
                            <CardDescription className="uppercase tracking-wider font-bold text-sm text-muted-foreground">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </CardDescription>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Table Fixtures */}
            <Card className="border-0 shadow-2xl">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8">
                    <CardTitle className="text-2xl font-black flex items-center gap-3">
                        <Volleyball className="w-8 h-8" />
                        Liste des Fixtures
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Select defaultValue="all">
                            <SelectTrigger className="w-44 h-12 rounded-xl">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes</SelectItem>
                                <SelectItem value="pending">En attente</SelectItem>
                                <SelectItem value="published">Publiées</SelectItem>
                                <SelectItem value="live">Live</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-2xl border border-border/50 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-b-2 border-border/50">
                                    <TableHead className="font-bold text-lg text-emerald-700 w-48">Match</TableHead>
                                    <TableHead className="font-bold text-lg text-emerald-700">Ligue</TableHead>
                                    <TableHead className="font-bold text-lg text-emerald-700">Date</TableHead>
                                    <TableHead className="font-bold text-lg text-emerald-700">Statut</TableHead>
                                    <TableHead className="font-bold text-lg text-emerald-700">Cotes</TableHead>
                                    <TableHead className="font-bold text-lg text-emerald-700 w-32">Prédiction IA</TableHead>
                                    <TableHead className="w-32 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredFixtures.map((fixture) => (
                                    <TableRow key={fixture.id} className="group hover:bg-emerald-500/5 border-b border-border/20 hover:border-emerald-500/30 transition-all">
                                        <TableCell className="font-semibold text-lg group-hover:text-emerald-700">
                                            {fixture.match}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-bold bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 border-blue-500/50">
                                                {fixture.league}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm opacity-75">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(fixture.date).toLocaleDateString('fr-FR')}
                                                <span className="text-xs">@{new Date(fixture.date).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="default"
                                                className={cn(
                                                    'font-bold px-3 py-1 shadow-md',
                                                    {
                                                        'bg-orange-500': fixture.status === 'pending',
                                                        'bg-emerald-500': fixture.status === 'published',
                                                        'bg-blue-500': fixture.status === 'live'
                                                    }
                                                )}
                                            >
                                                {fixture.status.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-mono">
                                            <div className="space-y-1 text-xs">
                                                <span className="text-emerald-600 font-bold">1: {fixture.odds.home}</span>
                                                <span>X: {fixture.odds.draw}</span>
                                                <span className="text-blue-600 font-bold">2: {fixture.odds.away}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-800 font-mono">
                                                {fixture.prediction}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Dialog>
                                                <DialogTrigger>
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-emerald-500/20 hover:text-emerald-600 p-2">
                                                        <Edit3 className="h-5 w-5" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Modifier Fixture</DialogTitle>
                                                    </DialogHeader>
                                                </DialogContent>
                                            </Dialog>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-destructive/20 hover:text-destructive p-2">
                                                <Trash2 className="h-5 w-5" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}