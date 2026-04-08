'use client'

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import {
    Lock, Unlock, Eye, Clock, Trophy, CheckCircle2, Search, RefreshCw, AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import AccountBalance from "../../../../components/layout/AccountBalance"
import AccountNavigation from "../../../../components/layout/AccountNavigation"
import axiosServices from "../../../utils/axiosServices"
import {FixtureCollection, MatchAnalysis} from "../../../types/types"
import Link from "next/link";



export default function MyPronoticPage() {
    const [balance, setBalance] = useState(25000)
    const [selectedMatches, setSelectedMatches] = useState<Set<string>>(new Set())
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

    // 💰 TOTAL
    const totalPrice = useMemo(() => {
        let sum = 0
        selectedMatches.forEach(id => {
            const m = allFixtures.find(f => f.id === id)
            sum += m?.price || 0
        })
        return sum
    }, [selectedMatches, allFixtures])

    const toggle = (id: string) => {
        setSelectedMatches(prev => {
            const s = new Set(prev)
            s.has(id) ? s.delete(id) : s.add(id)
            return s
        })
    }


    const unlock = async () => {
        if (!selectedMatches.size) return

        if (totalPrice > balance) {
            alert('💰 Solde insuffisant')
            return
        }

        setLoading(true)

        try {
            const matchIds = Array.from(selectedMatches)

            const res = await axiosServices.post('/api/unlock-matches', {
                matches: matchIds,
                total: totalPrice
            })
            await new Promise(r => setTimeout(r, 1000))
            console.log('Response:', res.data)

            // ✅ Update UI après succès
            setBalance(b => b - totalPrice)
            setSelectedMatches(new Set())

            alert(`✅ ${matchIds.length} match(s) débloqué(s)`)

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
    const format = (n: number) =>
        new Intl.NumberFormat('fr-FR').format(n) + ' Tokens'

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 py-6">

            <div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">

                {/* SIDEBAR */}
                <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-24">
                    <AccountBalance/>
                    <AccountNavigation />

                    <Card className="shadow-xl bg-gradient-to-br from-emerald-50 to-teal-50">
                        <CardContent className="p-6 space-y-4">

                            <div className="flex items-center gap-3">
                                <Eye />
                                <span className="font-bold">
                                    {selectedMatches.size} sélection(s)
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>Total</span>
                                <Badge>{format(totalPrice)}</Badge>
                            </div>

                            <Button
                                onClick={unlock}
                                disabled={loading || !selectedMatches.size}
                                className="w-full"
                            >
                                {loading ? <RefreshCw className="animate-spin" /> : <Unlock />}
                                Débloquer
                            </Button>

                        </CardContent>
                    </Card>
                </div>

                {/* MAIN */}
                <div className="lg:col-span-2 space-y-6">

                    {/* HEADER */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between gap-3 text-xl sm:text-3xl font-black">
                                <div className="flex items-center gap-3">
                                    <Trophy />
                                    Analyses Premium
                                </div>
                                <Link
                                    href="/my-pronostics/history"
                                    className="text-sm sm:text-base text-emerald-600 hover:underline font-semibold"
                                >
                                    Historiques
                                </Link>
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    {/* SEARCH */}
                    <Card>
                        <CardContent className="p-4 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2" />
                            <Input
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </CardContent>
                    </Card>

                    {/* LIST */}
                    <div className="space-y-6">

                        {groupedMatches.map(([leagueName, matches], groupIndex) => (

                            <div key={leagueName} className="space-y-3">

                                {/* HEADER LIGUE */}
                                <div className="flex items-center justify-between px-2">

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                                            <img
                                                src={matches[0]?.league_logo ?? "/default-logo.png"}
                                                alt={leagueName}
                                                className="w-9 h-9 lg:w-10 lg:h-10 object-cover rounded-xl"
                                            />
                                        </div>

                                        <div>
                                            <h2 className="font-black text-lg text-slate-900">
                                                {leagueName}
                                            </h2>
                                            <p className="text-xs text-slate-500">
                                                {matches.length} match{matches.length > 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>

                                    <Badge className="bg-blue-100 text-blue-700">
                                        {matches.length}
                                    </Badge>
                                </div>

                                {/* MATCHS */}
                                <div className="space-y-3">

                                    {matches.map((match, index) => {

                                        // 🔥 IMPORTANT: dernier élément GLOBAL
                                        const isLastGroup = groupIndex === groupedMatches.length - 1
                                        const isLastItem = index === matches.length - 1
                                        const isLast = isLastGroup && isLastItem

                                        return (
                                            <Card
                                                key={match.id}
                                                ref={isLast ? lastRef : null}
                                                className={cn(
                                                    "border-2 hover:shadow-xl transition",
                                                    selectedMatches.has(match.id)
                                                        ? "border-emerald-400 bg-emerald-50"
                                                        : "border-slate-200"
                                                )}
                                            >
                                                <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-center">

                                                    {/* Checkbox */}
                                                    <Checkbox
                                                        checked={selectedMatches.has(match.id)}
                                                        onCheckedChange={() => toggle(match.id)}
                                                    />

                                                    {/* Teams */}
                                                    <div className="flex items-center gap-2 flex-1">

                                                        <img
                                                            src={match.home_logo ?? "/default-logo.png"}
                                                            className="w-8 h-8"
                                                        />
                                                        <span className="text-sm font-bold truncate">
                                        {match.home_team}
                                    </span>

                                                        <span className="text-xs">vs</span>

                                                        <img
                                                            src={match.away_logo ?? "/default-logo.png"}
                                                            className="w-8 h-8"
                                                        />
                                                        <span className="text-sm font-bold truncate">
                                        {match.away_team}
                                    </span>

                                                    </div>

                                                    {/* Infos */}
                                                    <div className="flex flex-col items-end text-xs">
                                                        <span>{match.time}</span>

                                                        {match.locked && (
                                                            <Badge>{format(match.price)}</Badge>
                                                        )}
                                                    </div>

                                                </CardContent>
                                            </Card>
                                        )
                                    })}

                                </div>
                            </div>
                        ))}

                    </div>

                    {loading && (
                        <div className="text-center py-6">
                            <RefreshCw className="animate-spin mx-auto" />
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}