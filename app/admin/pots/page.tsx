'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, Users, Award, DollarSign, TrendingUp, Filter, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import {  format } from 'date-fns'; // ✅ v3 export direct
import { fr } from 'date-fns/locale';
type BadgeProps = React.ComponentProps<typeof Badge>;
// Mock data pots
const pots = [
    {
        id: '#POT001',
        title: 'PSG vs Real Madrid UCL',
        players: 128,
        pool: '250,000 XAF',
        creator: 'Julio Mbah',
        date: '2026-04-02T20:00:00Z',
        status: 'open' as const,
        league: 'Ligue des Champions'
    },
    {
        id: '#POT002',
        title: 'Man Utd vs Liverpool PL',
        players: 89,
        pool: '180,000 XAF',
        creator: 'Sarah Kamga',
        date: '2026-04-02T20:00:00Z',
        status: 'open' as const,
        league: 'Premier League'
    },
    {
        id: '#POT003',
        title: 'Bayern vs Dortmund BL',
        players: 156,
        pool: '320,000 XAF',
        creator: 'Pierre Ngu',
        date: '2026-04-03T18:00:00Z',
        status: 'closed' as const,
        league: 'Bundesliga'
    },
    {
        id: '#POT004',
        title: 'Barça vs Atletico LL',
        players: 67,
        pool: '140,000 XAF',
        creator: 'Marie T.',
        date: '2026-04-04T21:00:00Z',
        status: 'open' as const,
        league: 'La Liga'
    },
    {
        id: '#POT004',
        title: 'Girona vs Juventus',
        players: 67,
        pool: '140,000 XAF',
        creator: 'Marie T.',
        date: '2026-04-02T21:00:00Z',
        status: 'open' as const,
        league: 'Serie A'
    },
];

const statusConfig: Record<string, BadgeProps> = {
    open: { variant: 'default', className: 'bg-emerald-500 hover:bg-emerald-600 font-bold shadow-md' },
    closed: { variant: 'secondary', className: 'bg-orange-500 hover:bg-orange-600 font-bold shadow-md' },
    finished: { variant: 'outline', className: 'border-gray-500 text-gray-700 font-bold' }
};

export default function AdminPotPage() {
    const [search, setSearch] = useState('');
    const [filterLeague, setFilterLeague] = useState('all');

    // Group by date
    // Remplace groupBy
    const potsByDay = Object.entries(
        pots.reduce((acc: Record<string, any[]>, pot) => {
            const dateKey = format(new Date(pot.date), 'yyyy-MM-dd', { locale: fr });
            acc[dateKey] = acc[dateKey] || [];
            acc[dateKey].push(pot);
            return acc;
        }, {})
    );

    const stats = {
        total: pots.length,
        open: pots.filter(p => p.status === 'open').length,
        totalPool: pots.reduce((sum, pot) => sum + parseInt(pot.pool.replace(/[^\d]/g, '')), 0),
        avgPlayers: Math.round(pots.reduce((sum, pot) => sum + pot.players, 0) / pots.length)
    };

    return (
        <div className="space-y-8">

            {/* Header + Stats */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all">
                    <CardContent className="p-8 text-center">
                        <Users className="w-16 h-16 mx-auto mb-4 text-emerald-600 drop-shadow-lg" />
                        <CardTitle className="text-3xl font-black text-emerald-600">{stats.total}</CardTitle>
                        <CardDescription className="font-bold uppercase tracking-wider">Pots Totaux</CardDescription>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all">
                    <CardContent className="p-8 text-center">
                        <Award className="w-16 h-16 mx-auto mb-4 text-blue-600 drop-shadow-lg" />
                        <CardTitle className="text-3xl font-black text-blue-600">{stats.open}</CardTitle>
                        <CardDescription className="font-bold uppercase tracking-wider">Pots Ouverts</CardDescription>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all">
                    <CardContent className="p-8 text-center">
                        <DollarSign className="w-16 h-16 mx-auto mb-4 text-purple-600 drop-shadow-lg" />
                        <CardTitle className="text-3xl font-black text-purple-600">{stats.totalPool.toLocaleString()} XAF</CardTitle>
                        <CardDescription className="font-bold uppercase tracking-wider">Pool Total</CardDescription>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all">
                    <CardContent className="p-8 text-center">
                        <TrendingUp className="w-16 h-16 mx-auto mb-4 text-orange-600 drop-shadow-lg" />
                        <CardTitle className="text-3xl font-black text-orange-600">{stats.avgPlayers}</CardTitle>
                        <CardDescription className="font-bold uppercase tracking-wider">Moy. Joueurs</CardDescription>
                    </CardContent>
                </Card>
            </div>

            {/* Filtres + Search */}
            <Card className="border-0 shadow-2xl">
                <CardContent className="p-8 pt-6">
                    <div className="flex flex-wrap gap-4 items-center">
                        <h1 className="text-3xl font-black flex items-center gap-3 bg-gradient-to-r from-gray-900 to-emerald-600 bg-clip-text text-transparent flex-1">
                            <CalendarDays className="w-10 h-10" />
                            Pots par Jour ({potsByDay.reduce((sum, [_, pots]) => sum + pots.length, 0)})
                        </h1>

                        <div className="flex flex-1 max-w-md gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    placeholder="Rechercher pot ou créateur..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="h-12 pl-12 pr-4 rounded-2xl shadow-sm backdrop-blur-sm"
                                />
                            </div>
                            <Select value={filterLeague}  onValueChange={(value) => setFilterLeague(value ?? "")}>
                                <SelectTrigger className="h-12 w-44 rounded-2xl shadow-sm">
                                    <SelectValue placeholder="Ligue" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Toutes ligues</SelectItem>
                                    <SelectItem value="Ligue des Champions">LDC</SelectItem>
                                    <SelectItem value="Premier League">PL</SelectItem>
                                    <SelectItem value="Bundesliga">BL</SelectItem>
                                    <SelectItem value="La Liga">LL</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button className="h-12 px-8 whitespace-nowrap shadow-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 font-bold">
                            + Nouveau Pot
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Pots Groupés par Jour */}
            <div className="space-y-6">
                {potsByDay.map(([date, dayPots]) => (
                    <Card key={date} className="border-0 shadow-2xl hover:shadow-3xl transition-all">
                        <CardHeader className="pb-6">
                            <CardTitle className="text-2xl font-black flex items-center gap-3 text-emerald-800">
                                <CalendarDays className="w-8 h-8" />
                                {format(new Date(date), 'EEEE d MMMM yyyy', { locale: fr })}
                                <Badge className="ml-auto font-bold bg-blue-500 hover:bg-blue-600">
                                    {dayPots.length} pot{dayPots.length > 1 ? 's' : ''}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b-2 border-border/50 hover:bg-transparent">
                                        <TableHead className="w-20 font-bold text-lg text-emerald-700">ID</TableHead>
                                        <TableHead className="font-bold text-lg text-emerald-700">Match</TableHead>
                                        <TableHead className="font-bold text-lg text-emerald-700">Créateur</TableHead>
                                        <TableHead className="font-bold text-lg text-emerald-700">Joueurs</TableHead>
                                        <TableHead className="font-bold text-lg text-emerald-700">Pool</TableHead>
                                        <TableHead className="font-bold text-lg text-emerald-700">Ligue</TableHead>
                                        <TableHead className="font-bold text-lg text-emerald-700">Statut</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dayPots.map((pot: any) => (
                                        <TableRow key={pot.id} className="group hover:bg-emerald-500/5 hover:border-emerald-500/30 transition-all border-b border-border/20">
                                            <TableCell className="font-mono font-bold text-emerald-700">{pot.id}</TableCell>
                                            <TableCell className="font-semibold text-lg group-hover:text-emerald-700 max-w-md truncate">
                                                {pot.title}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                                                        {pot.creator.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-medium truncate max-w-24">{pot.creator}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-bold text-2xl text-blue-600">{pot.players}</TableCell>
                                            <TableCell>
                        <span className="font-mono font-bold text-xl text-purple-600">
                          {pot.pool}
                        </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-bold px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-300">
                                                    {pot.league}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    {...statusConfig[pot.status]}
                                                    className="font-bold shadow-md px-4 py-2 text-sm"
                                                >
                                                    {pot.status === 'open' ? '🔓 Ouvert' : '🔒 Fermé'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {potsByDay.length === 0 && (
                <Card className="border-0 shadow-2xl text-center p-20">
                    <CardContent>
                        <CalendarDays className="w-24 h-24 mx-auto mb-8 text-muted-foreground opacity-50" />
                        <h3 className="text-2xl font-black mb-2 text-muted-foreground">Aucun pot</h3>
                        <p className="text-lg text-muted-foreground mb-8">Aucun pot trouvé pour cette période</p>
                        <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 font-bold px-12 h-14">
                            Créer Premier Pot
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}