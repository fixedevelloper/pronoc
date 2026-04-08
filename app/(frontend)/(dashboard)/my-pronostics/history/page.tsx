'use client'

import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import {
    Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Trophy, Clock, CheckCircle2, XCircle, Target, AlertCircle,
    RefreshCw, Eye, Calendar, ChevronDown
} from 'lucide-react'
import AccountBalance from '../../../../../components/layout/AccountBalance'
import AccountNavigation from '../../../../../components/layout/AccountNavigation'
import axiosServices from '../../../../utils/axiosServices'
import {cn} from "../../../../utils/utils";
import Link from "next/link";
import {AiPredictionCollection, AiPredictionResource} from "../../../../types/AiPredictionResource";

interface GroupedPrediction {
    date: string
    predictions: AiPredictionResource[]
}

export default function HistoryPredictionPage() {
    // 🔥 STATES
    const [predictions, setPredictions] = useState<AiPredictionResource[]>([])
    const [loading, setLoading] = useState(false) // ✅ false initial
    const [page, setPage] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [balance, setBalance] = useState(25000)
    const lastElementRef = useRef<HTMLDivElement>(null)

    console.log('🔄 Render:', { predictions: predictions.length, page, loading, hasMore })

    // 🔥 LOAD PREDICTIONS ✅ deps MINIMALES
    const loadPredictions = useCallback(async () => {
        console.log('🚀 loadPredictions START', { page, loading, hasMore })

        if (loading) {
            console.log('⏸️ SKIP: already loading')
            return
        }

        setLoading(true)
        console.log('📡 API call page', page)

        try {
            const res = await axiosServices.get<AiPredictionCollection>(
                `/api/predictions/history?page=${page}&per_page=15`
            )
            const newData = res.data.data || []
            console.log('📥 API response:', newData.length, 'items')

            setPredictions(prev => {
                const ids = new Set(prev.map(p => p.id))
                const filtered = newData.filter(p => !ids.has(p.id))
                console.log('➕ Adding', filtered.length, 'new predictions')
                return [...prev, ...filtered]
            })

            setPage(p => {
                const next = p + 1
                console.log('📄 Next page:', next)
                return next
            })

            setHasMore(newData.length === 15)
            console.log('✅ hasMore:', newData.length === 15)

        } catch (error) {
            console.error('❌ API ERROR:', error)
        } finally {
            setLoading(false)
            console.log('🏁 loadPredictions END')
        }
    }, [page]) // ✅ UNIQUEMENT page !

    // 🔥 INITIAL LOAD
    useEffect(() => {
        console.log('🎯 useEffect initial load')
        loadPredictions()
    }, []) // ✅ Vide = 1x

    // 🔥 INFINITE SCROLL OBSERVER ✅ DEBUG COMPLET
    useEffect(() => {
        console.log('👁️ Observer setup', {
            hasMore,
            loading,
            hasElement: !!lastElementRef.current
        })

        const observer = new IntersectionObserver(
            ([entry]) => {
                console.log('🎯 INTERSECTION:', {
                    isIntersecting: entry.isIntersecting,
                    hasMore,
                    loading,
                    target: entry.target.textContent
                })

                if (entry.isIntersecting && hasMore && !loading) {
                    console.log('✅ TRIGGER loadPredictions!')
                    loadPredictions()
                } else {
                    console.log('❌ SKIP:', { isIntersecting: entry.isIntersecting, hasMore, loading })
                }
            },
            {
                rootMargin: '300px 0px 100px 0px', // ✅ Très large
                threshold: 0.1 // ✅ 10% visible
            }
        )

        // Observe si élément existe
        const element = lastElementRef.current
        if (element) {
            console.log('✅ OBSERVING element:', element)
            observer.observe(element)
        } else {
            console.log('⚠️ NO ELEMENT to observe')
        }

        // ✅ CLEANUP
        return () => {
            console.log('🧹 Observer disconnect')
            observer.disconnect()
        }
    }, [hasMore, loading, loadPredictions])

    // 🔥 GROUP BY DATE
    const grouped: GroupedPrediction[] = useMemo(() => {
        console.log('📅 Grouping', predictions.length, 'predictions')
        const map: Record<string, AiPredictionResource[]> = {}

        predictions.forEach(pred => {
            const date = new Date(pred.created_at).toLocaleDateString('fr-FR', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            })
            map[date] = map[date] || []
            map[date].push(pred)
        })

        const result = Object.entries(map)
            .map(([date, preds]) => ({ date, predictions: preds }))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        console.log('📋 Groups created:', result.length)
        return result
    }, [predictions])

    // 🔥 STATS
    const stats = useMemo(() => {
        const total = predictions.length
        const unlocked = predictions.filter(p => p.stats?.is_1x2_correct).length
        const successRate = total > 0
            ? (predictions.filter(p => p.stats?.is_1x2_correct).length / total * 100)
            : 0
        return { total, unlocked, successRate: successRate.toFixed(1) }
    }, [predictions])

    const formatConfidence = (conf?: number) => conf ? `${Math.round(conf)}%` : 'N/A'

    const getStatusIcon = (status?: string) => {
        switch (status) {
            case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            case 'pending': return <Clock className="w-5 h-5 text-amber-500" />
            case 'failed': return <XCircle className="w-5 h-5 text-red-500" />
            default: return <Eye className="w-5 h-5 text-slate-500" />
        }
    }

    // 🔥 LOADING INITIAL
    if (predictions.length === 0 && loading) {
        console.log('⏳ Initial loading screen')
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center p-8">
                <Card className="w-full max-w-md shadow-2xl border-0">
                    <CardContent className="p-12 text-center">
                        <RefreshCw className="w-20 h-20 mx-auto mb-6 text-emerald-500 animate-spin shadow-2xl" />
                        <h2 className="text-3xl font-black text-slate-800 mb-4">Chargement...</h2>
                        <p className="text-xl text-slate-600">Récupération de l'historique</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-blue-50 py-6 lg:py-12">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10">

                {/* SIDEBAR */}
                <div className="lg:col-span-1 space-y-8 sticky top-8 lg:top-28 self-start pt-4 lg:pt-0 max-h-screen lg:max-h-fit">
                    <AccountBalance/>
                    <AccountNavigation />

                    {/* STATS */}
                    <Card className="border-0 shadow-2xl bg-gradient-to-br from-emerald-50/95 to-blue-50/80 backdrop-blur-xl">
                        <CardHeader className="pb-6">
                            <CardTitle className="flex items-center gap-3 text-emerald-900">
                                <Trophy className="w-7 h-7" />
                                <span>Statistiques ({stats.total})</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 p-0">
                            <div className="grid grid-cols-2 gap-6 p-8 text-center">
                                <div className="space-y-2 hover:scale-105 transition-transform">
                                    <div className="text-4xl lg:text-5xl font-black text-slate-900">
                                        {stats.total}
                                    </div>
                                    <div className="text-sm uppercase tracking-wider text-slate-600 font-bold">
                                        Total
                                    </div>
                                </div>
                                <div className="space-y-2 hover:scale-105 transition-transform">
                                    <div className="text-4xl lg:text-5xl font-black text-emerald-600">
                                        {stats.unlocked}
                                    </div>
                                    <div className="text-sm uppercase tracking-wider text-slate-600 font-bold">
                                        Payantes
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 pt-0 pb-6">
                                <div className="flex items-center justify-center gap-3 text-xl lg:text-2xl font-black bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-8 py-4 rounded-3xl shadow-2xl backdrop-blur-sm">
                                    <Target className="w-8 h-8" />
                                    {stats.successRate}% succès
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* MAIN */}
                <div className="lg:col-span-3 space-y-10 lg:space-y-12">
                    {/* HEADER */}
                    <Card className="border-0 shadow-2xl backdrop-blur-xl overflow-hidden">
                        <CardHeader className="p-8 lg:p-12 bg-gradient-to-r from-slate-900/10 to-emerald-50/90 border-b border-slate-200/50">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
                                <div className="space-y-3">
                                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-800 bg-clip-text leading-tight">
                                        Mon Historique
                                    </h1>
                                    <p className="text-xl lg:text-2xl text-slate-600 font-medium max-w-2xl">
                                        Toutes vos prédictions IA Premium classées par date
                                    </p>
                                </div>
                                <Badge className="text-3xl lg:text-4xl px-12 py-6 font-black bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-2xl border-4 border-white/20 self-start lg:self-center">
                                    {predictions.length}
                                </Badge>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* GROUPS */}
                    <div className="space-y-12 lg:space-y-16">
                        {grouped.map((group, gIndex) => (
                            <section key={group.date}>
                                {/* DATE HEADER */}
                                <div className="sticky top-0 z-20 bg-gradient-to-r from-slate-50/98 to-emerald-50/80 backdrop-blur-3xl pt-12 lg:pt-16 -mt-12 lg:-mt-16 pb-8 border-b-2 border-slate-200/60 shadow-2xl">
                                    <div className="flex items-center gap-6 max-w-4xl mx-auto">
                                        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-slate-500 to-slate-700 rounded-3xl flex items-center justify-center shadow-2xl flex-shrink-0 p-2">
                                            <Calendar className="w-10 h-10 lg:w-12 lg:h-12 text-white drop-shadow-lg" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-2 leading-tight">
                                                {group.date}
                                            </h2>
                                            <div className="flex items-center gap-6 text-lg lg:text-xl text-slate-600">
                                                <Badge variant="secondary" className="text-lg px-6 py-2.5 font-bold bg-slate-100/80">
                                                    {group.predictions.length} prédiction{group.predictions.length > 1 ? 's' : ''}
                                                </Badge>
                                                <span className="font-semibold">
                          {group.predictions.filter(p => p.stats?.is_score_correct).length} réussies
                        </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* PREDICTIONS GRID */}
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-2 gap-6 lg:gap-8 max-w-7xl mx-auto pt-12">
                                    {group.predictions.map((pred, index) => (
                                        <Link href={`/my-pronostics/history/${pred.id}`} className="group block h-full">
                                        <Card
                                            key={pred.id}
                                            className="group hover:shadow-2xl hover:shadow-emerald-200/60 hover:scale-[1.02] hover:border-emerald-300/70 transition-all duration-500 border bg-gradient-to-b from-white/90 to-slate-50/90 backdrop-blur-xl shadow-lg overflow-hidden"
                                        >
                                            <CardHeader className="p-8 lg:p-10 relative pb-6 lg:pb-8">
                                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/70 via-blue-50/50 to-slate-50/60 opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                                                <div className="relative z-10 space-y-4">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <CardTitle className="text-xl lg:text-2xl xl:text-3xl font-black text-slate-900 line-clamp-2 leading-tight flex-1">
                                                            {pred.match_name}
                                                        </CardTitle>
                                                        <div className="flex items-center gap-2.5 flex-shrink-0 ml-auto">
                                                            {getStatusIcon(pred.stats?.real_score)}
                                                            <Badge
                                                                variant={pred.stats?.is_score_correct ? 'default' : 'secondary'}
                                                                className={cn(
                                                                    'px-4 py-2 text-sm lg:text-base font-bold shadow-lg',
                                                                    pred.stats?.is_score_correct && 'bg-emerald-500 text-white shadow-emerald-400/50',
                                                                    pred.stats?.is_score_correct && 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-amber-300/50',
                                                                    !pred.stats?.is_score_correct && 'bg-gradient-to-r from-red-400 to-rose-500 text-white shadow-red-300/50'
                                                                )}
                                                            >
                                                                {pred.stats?.real_score?.toUpperCase() || 'INFO'}
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3 text-sm lg:text-base text-slate-500 bg-slate-100/60 px-4 py-2.5 rounded-2xl backdrop-blur-sm">
                                                        <span className="font-medium truncate">{pred.source}</span>
                                                        <div className="w-px h-5 bg-slate-300 mx-2" />
                                                        <Clock className="w-4 h-4" />
                                                        <span>{new Date(pred.created_at).toLocaleTimeString('fr-FR', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}</span>
                                                    </div>
                                                </div>
                                            </CardHeader>

                                            <CardContent className="p-4 lg:p-5 space-y-4 pt-0">

                                                {/* SCORE VS MINI */}
                                                <div className="grid grid-cols-3 items-center gap-2 p-4 bg-gradient-to-r from-slate-50/80 to-emerald-50/60 rounded-xl border border-slate-200/30">

                                                    {/* HOME */}
                                                    <div className="text-center">
                                                        <div className="text-2xl lg:text-3xl font-extrabold text-slate-900">
                                                            {pred.score_exact?.split('-')[0] || '–'}
                                                        </div>
                                                        <div className="text-[10px] uppercase text-slate-500 font-bold">
                                                            DOM
                                                        </div>
                                                    </div>

                                                    {/* VS */}
                                                    <div className="flex flex-col items-center gap-1">
                                                        <div className="text-sm font-black text-slate-700 bg-white/70 px-3 py-1 rounded-lg border">
                                                            VS
                                                        </div>
                                                    </div>

                                                    {/* AWAY */}
                                                    <div className="text-center">
                                                        <div className="text-2xl lg:text-3xl font-extrabold text-slate-900">
                                                            {pred.score_exact?.split('-')[1] || '–'}
                                                        </div>
                                                        <div className="text-[10px] uppercase text-slate-500 font-bold">
                                                            EXT
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* CONFIANCE MINI */}
                                                <div className="space-y-1">
                                                    <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Confiance
            </span>
                                                        <span className="font-bold text-slate-900">
                {formatConfidence(pred.confidence)}
            </span>
                                                    </div>

                                                    <div className="w-full h-2 bg-slate-200/60 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
                                                            style={{ width: formatConfidence(pred.confidence) }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* DETAILS MINI */}
                                                {pred.details && (
                                                    <div className="grid grid-cols-2 gap-3 p-4 bg-gradient-to-br from-blue-50/70 to-slate-50/60 rounded-xl border border-slate-200/30 text-xs">

                                                        {/* 1X2 */}
                                                        <div className="space-y-2">
                                                            <div className="font-bold text-slate-700">1X2</div>

                                                            <div className="flex justify-between">
                                                                <span>H</span>
                                                                <span className="font-bold text-emerald-600">
                        {pred.details.home_win_prob}%
                    </span>
                                                            </div>

                                                            <div className="flex justify-between text-slate-600">
                                                                <span>N</span>
                                                                <span>{pred.details.draw_prob}%</span>
                                                            </div>

                                                            <div className="flex justify-between text-slate-600">
                                                                <span>A</span>
                                                                <span>{pred.details.away_win_prob}%</span>
                                                            </div>
                                                        </div>

                                                        {/* OVER UNDER */}
                                                        <div className="space-y-2">
                                                            <div className="font-bold text-slate-700">O/U 2.5</div>

                                                            <div className="flex justify-between">
                                                                <span>O</span>
                                                                <span className="font-bold text-emerald-600">
                        {pred.details.over_2_5}%
                    </span>
                                                            </div>

                                                            <div className="flex justify-between text-slate-600">
                                                                <span>U</span>
                                                                <span>{pred.details.under_2_5}%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* ANALYSIS MINI */}
                                                {pred.analyse_fixture && (
                                                    <div className="p-4 bg-slate-50/80 rounded-xl border text-xs text-slate-700 line-clamp-3">
                                                        {pred.analyse_fixture}
                                                    </div>
                                                )}

                                            </CardContent>
                                        </Card></Link>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>

                    {/* 🔥 SENTINEL DEBUG */}
                    <div
                        ref={lastElementRef}
                        className="col-span-full h-40 lg:h-48 bg-gradient-to-r from-red-400/80 to-pink-500/80 rounded-3xl flex flex-col items-center justify-center text-center backdrop-blur-xl shadow-2xl border-4 border-red-300/50 mx-auto max-w-4xl"
                        style={{ minHeight: '150px' }}
                    >
                        <ChevronDown className="w-12 h-12 text-red-900 mb-4 animate-bounce" />
                        <div className="text-2xl font-black text-red-900 mb-2">
                            SCROLL ICI ↓
                        </div>
                        <div className="flex gap-4 text-lg text-red-800 font-bold">
                            <span>Page: {page}</span>
                            <span>HasMore: {String(hasMore)}</span>
                        </div>
                    </div>

                    {/* LOADING */}
                    {loading && predictions.length > 0 && (
                        <div className="col-span-full text-center py-20">
                            <div className="inline-flex items-center gap-4 bg-white/80 p-8 lg:p-12 rounded-3xl shadow-2xl backdrop-blur-xl border border-slate-200/50 max-w-2xl mx-auto">
                                <RefreshCw className="w-12 h-12 text-emerald-500 animate-spin" />
                                <div>
                                    <h3 className="text-2xl lg:text-3xl font-black text-slate-800 mb-2">
                                        Chargement page {page}
                                    </h3>
                                    <p className="text-xl text-slate-600">Nouvelle vague d'analyses...</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* END */}
                    {!loading && !hasMore && predictions.length > 0 && (
                        <div className="col-span-full text-center py-20">
                            <Card className="inline-block max-w-2xl mx-auto shadow-2xl border-0 bg-gradient-to-br from-emerald-50/95 to-blue-50/80">
                                <CardContent className="p-16 lg:p-20">
                                    <CheckCircle2 className="w-24 h-24 mx-auto mb-8 text-emerald-600 shadow-2xl" />
                                    <h3 className="text-4xl lg:text-5xl font-black text-emerald-800 mb-6">
                                        Tout chargé! 🎉
                                    </h3>
                                    <p className="text-2xl lg:text-3xl text-slate-600 mb-12">
                                        {predictions.length} prédictions dans l'historique
                                    </p>
                                    <div className="text-6xl animate-bounce">↑</div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}