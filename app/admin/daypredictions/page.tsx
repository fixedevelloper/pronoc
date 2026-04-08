'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, CalendarDays, Zap, Brain, Clock, Plus, Edit3, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import {DialogTrigger} from "../../../components/ui/dialog";
import Link from "next/link";
type BadgeProps = React.ComponentProps<typeof Badge>;
// Matchs DB
const matchsDb = {
    '2026-03-28': [
        { id: 1, match: 'PSG vs Marseille', league: 'Ligue 1', time: '20:45' },
        { id: 2, match: 'Real Madrid vs Sevilla', league: 'La Liga', time: '21:00' },
        { id: 3, match: 'Man City vs Arsenal', league: 'Premier League', time: '17:30' },
        { id: 4, match: 'Bayern vs Leipzig', league: 'Bundesliga', time: '18:30' },
    ],
    '2026-03-29': [
        { id: 5, match: 'Inter vs Juventus', league: 'Serie A', time: '20:45' },
        { id: 6, match: 'Liverpool vs Chelsea', league: 'Premier League', time: '20:00' },
    ],
    '2026-03-30': [
        { id: 7, match: 'Barça vs Valencia', league: 'La Liga', time: '16:15' },
        { id: 8, match: 'Dortmund vs Stuttgart', league: 'Bundesliga', time: '15:30' },
    ]
};

const dayBadgeVariants: Record<string, BadgeProps> = {
    '2026-03-28': { className: 'bg-emerald-500/20 text-emerald-900 border-emerald-300 font-bold shadow-lg' },
    '2026-03-29': { className: 'bg-blue-500/20 text-blue-900 border-blue-300 font-bold shadow-lg' },
    '2026-03-30': { className: 'bg-purple-500/20 text-purple-900 border-purple-300 font-bold shadow-lg' }
};

export default function AdminIaPredictionPage() {
    const [openDays, setOpenDays] = useState<Set<string>>(new Set(['2026-03-28']));

    const toggleDay = (date: string) => {
        const newOpenDays = new Set(openDays);
        if (openDays.has(date)) {
            newOpenDays.delete(date);
        } else {
            newOpenDays.add(date);
        }
        setOpenDays(newOpenDays);
    };

    const stats = {
        totalMatchs: Object.values(matchsDb).flat().length,
        totalJours: Object.keys(matchsDb).length,
        openJours: openDays.size
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 px-4 py-12">

            {/* Header Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
                <Card className="border-0 shadow-2xl hover:shadow-emerald-500/25 transition-all">
                    <CardContent className="p-8 text-center">
                        <CalendarDays className="w-20 h-20 mx-auto mb-6 text-emerald-600 drop-shadow-xl" />
                        <CardTitle className="text-4xl font-black text-emerald-600">{stats.totalMatchs}</CardTitle>
                        <p className="font-bold uppercase tracking-wider text-emerald-600 text-lg">Matchs Ajoutés</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-2xl hover:shadow-blue-500/25 transition-all">
                    <CardContent className="p-8 text-center">
                        <Zap className="w-20 h-20 mx-auto mb-6 text-blue-600 drop-shadow-xl" />
                        <CardTitle className="text-4xl font-black text-blue-600">{stats.totalJours}</CardTitle>
                        <p className="font-bold uppercase tracking-wider text-blue-600 text-lg">Jours</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-2xl hover:shadow-purple-500/25 transition-all">
                    <CardContent className="p-8 text-center">
                        <Brain className="w-20 h-20 mx-auto mb-6 text-purple-600 drop-shadow-xl" />
                        <CardTitle className="text-4xl font-black text-purple-600">{stats.openJours}</CardTitle>
                        <p className="font-bold uppercase tracking-wider text-purple-600 text-lg">Ouverts</p>
                    </CardContent>
                </Card>
            </div>
            {/* Bouton Ajouter Global */}
            <Card className="border-0 shadow-3xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 backdrop-blur-xl">
                <CardContent className="p-12 lg:p-10 text-center">
                    <Link href='/admin/daypredictions/add' >
                        <Button className="h-24 px-24 text-3xl font-black shadow-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 hover:shadow-emerald-500/60 hover:scale-[1.05] rounded-4xl">
                            <Plus className="w-12 h-12 mr-8" />
                            Ajouter Nouvelle selection
                        </Button>
                    </Link>

                </CardContent>
            </Card>
            {/* Jours en CARDS Collapsible */}
            {Object.entries(matchsDb).map(([date, dayMatches]: [string, any[]]) => (
                <Card key={date} className="border-0 shadow-2xl hover:shadow-emerald-500/20 transition-all overflow-hidden">
                    <Collapsible open={openDays.has(date)} onOpenChange={() => toggleDay(date)}>

                        {/* Header Card = Trigger */}
                        <CollapsibleTrigger>
                            <CardHeader className="p-6 lg:p-8 cursor-pointer hover:bg-gradient-to-r hover:from-slate-50/70 hover:to-emerald-50/70 transition-all group px-2 sm:px-4">
                                <div className="flex items-center justify-between w-full">
                                    {/* GAUCHE: Icon + Titre + Subtitle */}
                                    <div className="flex items-center gap-3 lg:gap-4 flex-1 min-w-0">
                                        <CalendarDays className="w-12 h-12 lg:w-14 lg:h-14 text-emerald-600 shadow-xl group-hover:scale-110 transition-all duration-300 flex-shrink-0" />

                                        <div className="min-w-0 flex-1">
                                            <CardTitle className="text-xl lg:text-2xl font-black text-slate-800 mb-1 leading-tight truncate">
                                                {date.split('-')[2]} Mars
                                            </CardTitle>
                                            <p className="text-lg lg:text-xl text-muted-foreground font-semibold truncate">
                                                {dayMatches.length} matchs programmés
                                            </p>
                                        </div>
                                    </div>
                                    <Button size="icon" variant="ghost" className="h-14 w-14 shadow-xl hover:bg-destructive/30 hover:shadow-destructive/30 hover:scale-105 rounded-2xl p-4 border border-red-200">
                                        <Edit3 className="w-7 h-7" />
                                    </Button>
                                    {/* DROITE: Badge + Chevron */}
                                    <div className="flex items-center gap-3 lg:gap-4 flex-shrink-0 ml-4">
                                        <Badge
                                            {...dayBadgeVariants[date as keyof typeof dayBadgeVariants]}
                                            className="text-lg lg:text-xl px-6 py-3 shadow-xl font-bold border-2 !h-auto whitespace-nowrap"
                                        >
                                            {dayMatches.length}
                                        </Badge>
                                        <ChevronDown
                                            className={cn(
                                                "w-10 h-10 lg:w-12 lg:h-12 text-slate-500 transition-all duration-500 group-hover:scale-105 flex-shrink-0 ml-2",
                                                openDays.has(date) && "rotate-180"
                                            )}
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                        </CollapsibleTrigger>

                        {/* Content Card */}
                        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp bg-gradient-to-b from-slate-50/70 to-transparent backdrop-blur-sm">
                            <CardContent className="p-0">
                                <div className="divide-y divide-border/20">
                                    {dayMatches.map((match: any) => (
                                        <div
                                            key={match.id}
                                            className="p-6 lg:p-8 group hover:bg-gradient-to-r hover:from-emerald-500/8 hover:to-blue-500/8 border-l-4 border-transparent hover:border-emerald-500/50 transition-all"
                                        >
                                            <div className="flex items-center gap-4 lg:gap-6">

                                                {/* Time Circle Compact */}
                                                <div className="flex flex-col items-center p-4 lg:p-3 bg-gradient-to-br from-emerald-400/20
                                                to-blue-400/20 rounded-2xl shadow-xl group-hover:shadow-emerald-400/40 transition-all min-w-[100px]">
                                                    <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-lg group-hover:animate-ping mb-2" />
                                                    <Clock className="w-10 h-10 text-emerald-600 group-hover:scale-110" />
                                                    <span className="text-sm lg:text-sm font-bold text-emerald-800 uppercase tracking-wide mt-2 bg-white/80 px-3 py-1.5 rounded-xl shadow-md">
        {match.time}
      </span>
                                                </div>

                                                {/* Match Compact */}
                                                <div className="flex-1 min-w-0">
                                                    <h5 className="font-black text-xl lg:text-xl mb-3 group-hover:text-emerald-800 leading-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text truncate">
                                                        {match.match}
                                                    </h5>
                                                    <Badge className="px-6 py-3 text-lg lg:text-xl font-bold shadow-xl bg-gradient-to-r from-blue-500/25 to-indigo-500/25 text-blue-900 border-2 border-blue-300 hover:from-blue-500/40 hover:shadow-blue-400/50 rounded-2xl tracking-wide">
                                                        {match.league}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </CollapsibleContent>
                    </Collapsible>
                </Card>
            ))}


        </div>
    );
}