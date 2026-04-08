'use client';

import {
    Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarFooter
} from '@/components/ui/sidebar';
import {
    Volleyball, Trophy, Users, BarChart3, Zap, DollarSign, Settings, ShieldCheck, LogOut
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useSession, signOut } from 'next-auth/react';
import React from "react";

const menuItems = [
    { icon: Volleyball, label: 'Fixtures', href: '/admin/fixtures', badge: '12' },
    { icon: Trophy, label: 'Pots', href: '/admin/pots', badge: '24', color: 'emerald' },
    { icon: Zap, label: 'IA Prédictions', href: '/admin/daypredictions', badge: '78%' },
    { icon: Users, label: 'Utilisateurs', href: '/admin/users', badge: '1.2k' },
    { icon: DollarSign, label: 'Transactions', href: '/admin/transactions', badge: '2.5M' },
    { icon: BarChart3, label: 'Stats', href: '/admin/stats' },
    { icon: Settings, label: 'Paramètres', href: '/admin/settings' },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();

    return (
        <TooltipProvider>
            <Sidebar className="border-r bg-gradient-to-b from-slate-50/80 to-white/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-xl shadow-xl">

                {/* Header */}
                <SidebarHeader className="p-6 border-b border-border/30 sticky top-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 backdrop-blur-sm">
                    <div className="flex items-center gap-4 p-4 -m-4 rounded-3xl bg-gradient-to-r from-emerald-500/15 to-blue-500/15 backdrop-blur-xl border border-emerald-500/30 shadow-2xl hover:shadow-emerald-500/50 transition-all">
                        <div className="p-3.5 bg-gradient-to-br from-emerald-500/30 to-teal-600/30 rounded-3xl backdrop-blur-xl shadow-xl border border-emerald-500/50 hover:scale-105 transition-all">
                            <Volleyball className="h-10 w-10 text-emerald-600 drop-shadow-2xl" />
                        </div>
                        <div>
                            <h2 className="font-black text-2xl bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                                PronoCrew
                            </h2>
                            <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full">
                                Admin v2.0
                            </p>
                        </div>
                    </div>
                </SidebarHeader>

                {/* Menu */}
                <SidebarContent className="p-2 space-y-1.5">
                    <SidebarGroup className="pt-0 flex flex-col gap-y-2">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

                            return (
                                <Tooltip key={item.href}>
                                    <TooltipTrigger>
                                        <div
                                            className={cn(
                                                "group flex items-center h-12 lg:h-14 px-3 lg:px-5 rounded-xl cursor-pointer select-none transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 backdrop-blur-xl border border-border/50 hover:border-emerald-500/40",
                                                isActive
                                                    ? "bg-gradient-to-r from-emerald-500/30 via-emerald-400/40 to-blue-500/30 border-emerald-500/60 shadow-xl shadow-emerald-500/40 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-500/50"
                                                    : "hover:bg-gradient-to-r hover:from-emerald-500/12 hover:to-blue-500/12 hover:text-emerald-700 dark:hover:text-emerald-300"
                                            )}
                                            onClick={() => router.push(item.href)}
                                        >
                                            <item.icon
                                                className={cn(
                                                    "h-5 w-5 lg:h-6 lg:w-6 flex-shrink-0 mr-3",
                                                    isActive ? "text-emerald-600 drop-shadow-lg scale-110 shadow-emerald-500/50" : "text-muted-foreground group-hover:text-emerald-600 group-hover:scale-110"
                                                )}
                                            />
                                            <span className="flex-1 text-sm lg:text-base font-medium truncate">{item.label}</span>
                                            {item?.badge && (
                                                <Badge
                                                    variant={isActive ? "default" : "secondary"}
                                                    className={cn(
                                                        "ml-2 h-5 px-2.5 py-0.5 text-xs font-bold rounded-full shadow-md",
                                                        isActive ? "bg-emerald-500/95 text-white shadow-emerald-500/50 hover:bg-emerald-600" : "bg-muted/90 hover:bg-emerald-500/80 text-muted-foreground hover:text-emerald-100"
                                                    )}
                                                >
                                                    {item?.badge}
                                                </Badge>
                                            )}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent
                                        side="right"
                                        sideOffset={12}
                                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-border/50 shadow-2xl p-2.5 rounded-xl z-50"
                                    >
                                        <p className="font-medium text-sm tracking-tight">{item.label}</p>
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </SidebarGroup>
                </SidebarContent>

                {/* Footer */}
                <SidebarFooter className="border-t border-border/30 mt-auto p-4 sticky bottom-0 bg-gradient-to-t from-slate-50/50 backdrop-blur-sm space-y-4">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-3 p-4 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 rounded-3xl backdrop-blur-xl border border-emerald-500/30 shadow-xl hover:shadow-emerald-500/50 transition-all">
                        <div className="text-center group hover:scale-105 transition-all">
                            <div className="font-black text-lg text-emerald-700 drop-shadow-lg">1,247</div>
                            <div className="text-xs uppercase tracking-wider text-emerald-600 font-bold">Joueurs</div>
                        </div>
                        <div className="text-center group hover:scale-105 transition-all">
                            <div className="font-black text-lg text-blue-700 drop-shadow-lg">24</div>
                            <div className="text-xs uppercase tracking-wider text-blue-600 font-bold">Pots</div>
                        </div>
                        <div className="text-center group hover:scale-105 transition-all">
                            <div className="font-black text-lg text-purple-700 drop-shadow-lg">2.5M</div>
                            <div className="text-xs uppercase tracking-wider text-purple-600 font-bold">XAF</div>
                        </div>
                    </div>

                    {/* Profile */}
                    {session?.user && (
                        <div className="p-4 bg-gradient-to-r from-slate-100/70 to-slate-200/50 dark:from-slate-800/70 dark:to-slate-700/50 rounded-3xl backdrop-blur-xl space-y-3 border border-slate-200/50 shadow-lg hover:shadow-emerald-500/20 transition-all">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl ring-2 ring-white/50">
                                    <ShieldCheck className="w-6 h-6 text-white drop-shadow-lg" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-bold text-lg truncate">{session.user.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                                </div>
                            </div>
                            <Button
                                variant="destructive"
                                size="sm"
                                className="w-full h-11 rounded-2xl font-bold shadow-lg hover:shadow-destructive/25 transition-all bg-destructive/10 hover:bg-destructive/20 border-destructive/30 text-destructive hover:text-destructive-foreground"
                                onClick={() => signOut({ callbackUrl: '/auth/login' })}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Déconnexion
                            </Button>
                        </div>
                    )}
                </SidebarFooter>
            </Sidebar>
        </TooltipProvider>
    );
}