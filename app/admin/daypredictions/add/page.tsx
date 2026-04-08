'use client'

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { CalendarDays, Plus, Check } from 'lucide-react'
import {MatchCardCompact} from "../../../../components/MatchCardCompact";
import axiosServices from "../../../utils/axiosServices";
import {FixtureCollection, MatchAnalysis} from "../../../types/types";
import {Badge} from "../../../../components/ui/badge";
import {cn} from "../../../utils/utils";

interface Match {
    id: string
    time: string
    match: string
    league: string
}

export default function AddPredictionDay() {
    const [selectedMatches, setSelectedMatches] = useState<Set<string>>(new Set())
    const [selectedDate, setSelectedDate] = useState('2026-03-28') // Date du jour
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [allFixtures, setAllFixtures] = useState<MatchAnalysis[]>([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const observer = useRef<IntersectionObserver | null>(null)

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

    // 🔍 FILTER
    const filtered = useMemo(() => {
        if (!searchTerm) return allFixtures
        const t = searchTerm.toLowerCase()

        return allFixtures.filter(f =>
            f.home_team.toLowerCase().includes(t) ||
            f.away_team.toLowerCase().includes(t) ||
            f.league.toLowerCase().includes(t)
        )
    }, [searchTerm, allFixtures])

    const toggleMatch = (matchId: string) => {
        const newSelected = new Set(selectedMatches)
        if (newSelected.has(matchId)) {
            newSelected.delete(matchId)
        } else {
            newSelected.add(matchId)
        }
        setSelectedMatches(newSelected)
    }

    const addPredictions = async () => {
        if (selectedMatches.size === 0) return
        try {
        const matchIds = Array.from(selectedMatches)
        const res = await axiosServices.post('/api/unlock-admin-matches', {
            matches: matchIds,
            total: 0.0
        })
        // TODO: Appel API pour créer prédictions
        alert(`${selectedMatches.size} matchs ajoutés!`)
        setSelectedMatches(new Set())
        } catch (error: any) {
            console.error('Unlock error:', error)

            alert(
                error?.response?.data?.message ||
                '❌ Une erreur est survenue'
            )
        } finally {
            setLoading(false)
        }
    }
    const toggle = (id: string) => {
        setSelectedMatches(prev => {
            const s = new Set(prev)
            s.has(id) ? s.delete(id) : s.add(id)
            return s
        })
    }
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

    return (
        <Card className="w-full max-w-7xl mx-auto shadow-xl border">

            <CardContent className="p-4 lg:p-6 space-y-6">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b">

                    <div className="flex items-center gap-3">
                        <CalendarDays className="w-10 h-10 text-emerald-600" />

                        <div>
                            <h3 className="text-lg lg:text-2xl font-bold text-slate-800">
                                {selectedDate.split('-')[2]} Mars 2026
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {allFixtures.length} matchs
                            </p>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        className="font-semibold"
                        onClick={() => console.log('Changer date')}
                    >
                        Changer date
                    </Button>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* SIDEBAR */}
                    <div className="lg:col-span-1 space-y-4">

                        <div className="flex flex-col gap-3">

                            <Button
                                className="w-full h-12 text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-600"
                                onClick={addPredictions}
                                disabled={selectedMatches.size === 0}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Ajouter ({selectedMatches.size})
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full h-12 text-sm"
                                onClick={() => setSelectedMatches(new Set())}
                                disabled={selectedMatches.size === 0}
                            >
                                <Check className="w-4 h-4 mr-2" />
                                Reset
                            </Button>

                        </div>

                        {selectedMatches.size > 0 && (
                            <div className="p-4 bg-emerald-50 border rounded-xl text-sm text-emerald-700 font-medium">
                                {selectedMatches.size} match(s) sélectionné(s)
                            </div>
                        )}
                    </div>

                    {/* MATCH LIST */}
                    <div className="lg:col-span-3 flex flex-col h-[75vh]">

                        {/* LIST SCROLL */}
                        <div className="flex-1 overflow-y-auto space-y-5 pr-2">
                            {groupedMatches.map(([leagueName, matches], groupIndex) => (
                                <div key={leagueName} className="space-y-2">

                                    {/* HEADER */}
                                    <div className="flex items-center justify-between sticky top-0 z-10 bg-white py-2">
                                        <div className="flex items-center gap-2">
                                            <img src={matches[0]?.league_logo} className="w-6 h-6 rounded" />
                                            <h2 className="text-sm font-bold text-slate-800">
                                                {leagueName}
                                            </h2>
                                        </div>
                                        <Badge>{matches.length}</Badge>
                                    </div>

                                    {/* MATCHES */}
                                    <div className="space-y-2">
                                        {matches.map((match, index) => {
                                            const isLast =
                                                groupIndex === groupedMatches.length - 1 &&
                                                index === matches.length - 1

                                            return (
                                                <Card
                                                    key={match.id}
                                                    ref={isLast ? lastRef : null}
                                                    className={cn(
                                                        "border hover:shadow-md transition",
                                                        selectedMatches.has(match.id)
                                                            ? "border-emerald-400 bg-emerald-50"
                                                            : "border-slate-200"
                                                    )}
                                                >
                                                    <CardContent className="p-3 flex items-center gap-3">

                                                        <Checkbox
                                                            checked={selectedMatches.has(match.id)}
                                                            onCheckedChange={() => toggle(match.id)}
                                                        />

                                                        <div className="flex items-center gap-2 flex-1 text-sm">
                                                            <img src={match.home_logo?? "/default-logo.png"} className="w-6 h-6" />
                                                            <span className="truncate">{match.home_team}</span>

                                                            <span className="text-xs text-slate-400">vs</span>

                                                            <img src={match.away_logo?? "/default-logo.png"} className="w-6 h-6" />
                                                            <span className="truncate">{match.away_team}</span>
                                                        </div>

                                                        <div className="text-xs text-slate-500">
                                                            {match.time}
                                                        </div>

                                                    </CardContent>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}