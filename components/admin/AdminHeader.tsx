'use client';

import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
    Search, Bell, ChevronDown, ShieldCheck, Download,
    LogOut, Settings, User, Mail, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Link from 'next/link';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export default function AdminHeader() {
    const { data: session } = useSession();
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <header className="sticky top-0 z-50 border-b border-border/50 bg-card/95 backdrop-blur-xl shadow-lg">
            <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">

                {/* Left: Mobile Trigger + Search */}
                <div className="flex items-center gap-4 flex-1 max-w-lg lg:max-w-2xl">
                    <SidebarTrigger className="lg:hidden h-12 w-12 p-0" />
                    <div className="flex items-center gap-3 flex-1">
                        <Button variant="ghost" size="icon" className="h-12 w-12 p-0 hover:bg-emerald-500/10">
                            <Search className="h-5 w-5 text-muted-foreground hover:text-emerald-600" />
                        </Button>
                        <Input
                            placeholder="🔍 Fixtures, joueurs, pots..."
                            className="h-12 rounded-2xl border-2 shadow-sm focus-visible:ring-emerald-500 focus-visible:border-emerald-500 bg-background/80 backdrop-blur-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Center: Stats */}
                <div className="hidden md:flex items-center gap-6 bg-muted/50 px-6 py-3 rounded-3xl backdrop-blur-xl border border-border/50 shadow-lg">
                    <div className="text-center group hover:scale-105 transition-all">
                        <div className="font-black text-2xl text-emerald-600 drop-shadow-lg">24</div>
                        <div className="text-xs uppercase tracking-wider text-muted-foreground">Pots</div>
                    </div>
                    <div className="text-center group hover:scale-105 transition-all">
                        <div className="font-black text-2xl text-blue-600 drop-shadow-lg">1,247</div>
                        <div className="text-xs uppercase tracking-wider text-muted-foreground">Joueurs</div>
                    </div>
                    <div className="text-center group hover:scale-105 transition-all">
                        <div className="font-black text-2xl text-purple-600 drop-shadow-lg">78%</div>
                        <div className="text-xs uppercase tracking-wider text-muted-foreground">IA</div>
                    </div>
                </div>

                {/* Right: Actions + Profile */}
                <div className="flex items-center gap-3">

                    {/* Notifications */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative h-12 w-12 hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-blue-500/10 shadow-md"
                    >
                        <Bell className="h-5 w-5" />
                        <Badge className="absolute -top-1.5 -right-1.5 h-6 w-6 bg-destructive text-xs p-0 border-2 border-card rounded-full animate-pulse">
                            3
                        </Badge>
                    </Button>

                    {/* Export */}
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-12 px-6 gap-2 border-emerald-200 hover:bg-emerald-500/10 font-semibold hidden lg:flex"
                    >
                        <Download className="h-4 w-4" />
                        Export
                    </Button>

                    {/* Profile Dropdown */}
                    <Popover>
                        <PopoverTrigger>
                            <Button
                                variant="ghost"
                                className="h-12 px-6 gap-3 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 backdrop-blur-sm border border-emerald-500/30 rounded-2xl font-semibold group hover:shadow-xl hover:shadow-emerald-500/20"
                            >
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-105">
                                    <ShieldCheck className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-left hidden lg:block">
                                    <p className="font-bold truncate max-w-[140px]">
                                        {session?.user?.name || 'Admin'}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                                        Super Admin
                                    </p>
                                </div>
                                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0 border-emerald-200 shadow-2xl rounded-2xl" align="end">
                            <div className="p-6 border-b border-border/50 bg-gradient-to-b from-emerald-500/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl">
                                        <ShieldCheck className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl">{session?.user?.name}</h3>
                                        <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                                        <Badge className="mt-2 bg-emerald-500">Super Admin</Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 space-y-2">
                                <Button variant="ghost" className="w-full justify-start h-12">
                                    <Link href="/admin/profile">
                                        <User className="mr-3 h-5 w-5" />
                                        Profil
                                    </Link>
                                </Button>
                                <Button variant="ghost" className="w-full justify-start h-12">
                                    <Link href="/admin/settings">
                                        <Settings className="mr-3 h-5 w-5" />
                                        Paramètres
                                    </Link>
                                </Button>
                                <Button
                                    className="w-full h-12 text-destructive hover:bg-destructive/10 border-destructive/20 mt-2"
                                    onClick={() => signOut({ callbackUrl: '/auth/login' })}
                                >
                                    <LogOut className="mr-3 h-5 w-5" />
                                    Déconnexion
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </header>
    );
}