'use client'

import { Check, Clock, Edit3, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import React from "react";

interface Match {
    id: string
    time: string
    match: string
    league: string
}

interface MatchCardCompactProps {
    match: Match
    showCheckbox?: boolean
    showActions?: boolean
    selected?: boolean
    onToggle?: (id: string, checked: boolean) => void
    className?: string
}

export function MatchCardCompact({
                                     match,
                                     showCheckbox = false,
                                     showActions = true,
                                     selected = false,
                                     onToggle,
                                     className = ""
                                 }: MatchCardCompactProps) {
    return (
        <div
            className={`p-6 lg:p-8 group hover:bg-gradient-to-r hover:from-emerald-500/8 hover:to-blue-500/8 border-l-4 border-transparent hover:border-emerald-500/50 transition-all ${className}`}
        >
            <div className="flex items-center gap-4 lg:gap-6">

                {/* Checkbox */}
                {showCheckbox && (
                    <Checkbox
                        checked={selected}
                        onCheckedChange={(checked) => onToggle?.(match.id, !!checked)}
                        className="h-8 w-8 border-2 border-slate-300 rounded-xl flex-shrink-0 mt-1 group-hover:border-emerald-400 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 shadow-md"
                    />
                )}

                {/* Time Circle */}
                <div className="flex flex-col items-center p-4 lg:p-5 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-2xl shadow-xl group-hover:shadow-emerald-400/40 transition-all min-w-[100px] flex-shrink-0">
                    <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-lg group-hover:animate-ping mb-2" />
                    <Clock className="w-10 h-10 text-emerald-600 group-hover:scale-110" />
                    <span className="text-lg lg:text-xl font-bold text-emerald-800 uppercase tracking-wide mt-2 bg-white/80 px-3 py-1.5 rounded-xl shadow-md">
            {match.time}
          </span>
                </div>

                {/* Match Info */}
                <div className="flex-1 min-w-0">
                    <h4 className="font-black text-2xl lg:text-3xl mb-3 group-hover:text-emerald-800 leading-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text truncate">
                        {match.match}
                    </h4>
                    <Badge className="px-6 py-3 text-lg lg:text-xl font-bold shadow-xl bg-gradient-to-r from-blue-500/25 to-indigo-500/25 text-blue-900 border-2 border-blue-300 hover:from-blue-500/40 hover:shadow-blue-400/50 rounded-2xl tracking-wide">
                        {match.league}
                    </Badge>
                </div>

                {/* Actions */}
                {showActions && (
                    <div className="flex gap-2 opacity-0 lg:opacity-50 group-hover:opacity-100 transition-all ml-auto">
                        <Dialog>
                            <DialogTrigger>
                                <Button size="icon" variant="ghost" className="h-14 w-14 shadow-xl hover:bg-white/60 backdrop-blur-sm hover:shadow-emerald-400/40 hover:scale-105 rounded-2xl p-4 border border-emerald-200">
                                    <Edit3 className="w-7 h-7" />
                                </Button>
                            </DialogTrigger>
                        </Dialog>
                        <Button size="icon" variant="ghost" className="h-14 w-14 shadow-xl hover:bg-destructive/30 hover:shadow-destructive/30 hover:scale-105 rounded-2xl p-4 border border-red-200">
                            <Trash2 className="w-7 h-7" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}