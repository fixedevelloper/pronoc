'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Volleyball, Trophy, Users, Zap, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from "react";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900/50 dark:to-emerald-900/20 space-y-20 py-12 px-4 lg:px-8">

            {/* HERO */}
            <section className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
                <div className="order-2 lg:order-1 space-y-8 text-center lg:text-left">
                    <Badge className="inline-flex px-4 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold uppercase text-sm tracking-wider">
                        <Zap className="w-3 h-3 mr-1" />
                        IA 78% Précise
                    </Badge>
                    <h1 className="text-4xl lg:text-6xl xl:text-7xl font-black leading-tight bg-gradient-to-r from-gray-900 via-emerald-600 to-blue-600 bg-clip-text text-transparent">
                        PronoCrew
                        <br />
                        <span className="text-emerald-600">Prono + Pots</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">⚽</span>
                    </h1>
                    <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                        Pronostics IA + Pots Cameroun. Gagnez XAF avec vos amis.
                        <span className="font-bold text-emerald-600">78% précision</span>, MTN MoMo, classements live.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                        <Button  size="lg" className="px-8 h-14 text-lg font-bold shadow-2xl hover:shadow-emerald-500/50 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600">
                            <Link href="/pots">
                                Jouer un Pot ⚽
                            </Link>
                        </Button>
                        <Button  variant="outline" size="lg" className="px-8 h-14 text-lg font-bold border-emerald-500 hover:bg-emerald-500/10">
                            <Link href="/auth/register">
                                S'inscrire Gratuit
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className="order-1 lg:order-2 flex justify-center">
                    <img
                        src="/images/hero.webp"
                        alt="PronoCrew Football"
                        className="w-full max-w-2xl lg:max-w-4xl drop-shadow-2xl rounded-3xl animate-float hover:scale-105 transition-all duration-500"
                        width={800}
                        height={600}
                    />
                </div>
            </section>

            {/* STATS */}
            <section className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-4">
                {[
                    { icon: Users, num: '1.2K', label: 'Joueurs Actifs', color: 'emerald' },
                    { icon: Trophy, num: '24', label: 'Pots Ouverts', color: 'blue' },
                    { icon: ShieldCheck, num: '2.5M XAF', label: 'Prize Pool', color: 'gold' }
                ].map((stat, i) => (
                    <Card key={i} className="group hover:scale-105 transition-all duration-500 border-0 shadow-xl hover:shadow-2xl bg-gradient-to-br">
                        <CardContent className="p-8 text-center">
                            <div className={`w-20 h-20 mx-auto mb-6 p-5 rounded-3xl bg-${stat.color}-500/10 group-hover:bg-${stat.color}-500/20 backdrop-blur-xl border border-${stat.color}-500/30 flex items-center justify-center shadow-2xl`}>
                                <stat.icon className={`w-12 h-12 text-${stat.color}-600 drop-shadow-lg group-hover:scale-110 transition-all`} />
                            </div>
                            <CardTitle className={`text-4xl lg:text-5xl font-black bg-gradient-to-r from-${stat.color}-600 to-${stat.color}-700 bg-clip-text text-transparent mb-2`}>
                                {stat.num}
                            </CardTitle>
                            <CardDescription className="text-lg font-semibold text-muted-foreground group-hover:text-foreground transition-all">
                                {stat.label}
                            </CardDescription>
                        </CardContent>
                    </Card>
                ))}
            </section>

            {/* FEATURES */}
            <section className="max-w-6xl mx-auto px-4">
                <h2 className="text-4xl lg:text-5xl font-black text-center mb-20 bg-gradient-to-r from-gray-900 to-emerald-600 bg-clip-text text-transparent">
                    Pourquoi <span className="text-emerald-600">PronoCrew</span> ?
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: 'Pots Entre Amis', desc: 'Créez des pots privés, challengez vos amis, gagnez XAF. Classements live.', icon: Trophy },
                        { title: 'IA 78% Précise', desc: 'Pronostics IA boostés par ML. Stats avancées par ligue/match.', icon: Zap },
                        { title: 'MTN MoMo Instant', desc: 'Dépôts/retraits Mobile Money. Sécurisé + vérifié Cameroun.', icon: ShieldCheck }
                    ].map((feature, i) => (
                        <Card key={i} className="group hover:scale-105 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
                            <CardContent className="p-8 lg:p-10 relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 group-hover:opacity-100 opacity-0 transition-all" />
                                <feature.icon className="w-20 h-20 mx-auto mb-6 p-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 text-white drop-shadow-2xl" />
                                <CardTitle className="text-2xl font-black text-center mb-4 group-hover:text-emerald-600 transition-all">
                                    {feature.title}
                                </CardTitle>
                                <CardDescription className="text-lg text-muted-foreground text-center leading-relaxed group-hover:text-foreground">
                                    {feature.desc}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* CTA POTS */}
            <section className="max-w-4xl mx-auto px-4 text-center py-24">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-4xl p-12 lg:p-20 shadow-2xl text-white backdrop-blur-xl border border-emerald-500/30">
                    <Trophy className="w-24 h-24 mx-auto mb-8 drop-shadow-2xl animate-bounce" />
                    <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight">
                        24 Pots Ouverts
                        <br />
                        <span className="text-emerald-200">2.5M XAF à Gagner</span>
                    </h2>
                    <p className="text-xl lg:text-2xl opacity-90 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Rejoignez un pot dès maintenant et commencez à pronostiquer!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Button size="lg" className="px-12 h-16 text-xl shadow-2xl hover:shadow-emerald-500/50 bg-white/20 backdrop-blur-xl border-white/30 text-white hover:text-emerald-600 hover:bg-white/40 font-bold">
                            <Link href="/pots">
                                Jouer Maintenant ⚽
                            </Link>
                        </Button>
                        <Button variant="outline" size="lg" className="px-12 h-16 text-xl border-white/50 font-bold">
                            <Link href="/auth/register">
                                Créer Compte
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* TÉMOIGNAGES */}
            <section className="max-w-5xl mx-auto px-4">
                <h2 className="text-4xl lg:text-5xl font-black text-center mb-20 bg-gradient-to-r from-gray-900 to-emerald-600 bg-clip-text text-transparent">
                    Ce que disent les <span className="text-emerald-600">gagnants</span>
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { name: 'Julio Mbah', role: 'Douala', quote: 'Gagné 150k XAF en 1 semaine! IA top niveau.', avatar: '/images/user1.jpg' },
                        { name: 'Sarah Kamga', role: 'Yaoundé', quote: 'Pots entre amis = fun + argent. Parfait!', avatar: '/images/user2.jpg' },
                        { name: 'Pierre Ngu', role: 'Bafoussam', quote: 'MoMo instantané. Zéro tracas.', avatar: '/images/user3.jpg' }
                    ].map((testimonial, i) => (
                        <Card key={i} className="group hover:scale-105 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden bg-gradient-to-b from-white/80 to-slate-50/50 dark:from-slate-900/80 dark:to-slate-800/80 backdrop-blur-xl">
                            <CardContent className="p-8 relative pt-16">
                                <div className="absolute top-6 left-6 w-20 h-20 rounded-3xl overflow-hidden shadow-2xl group-hover:scale-110 transition-all">
                                    <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                                </div>
                                <p className="text-lg leading-relaxed italic text-muted-foreground mb-6 group-hover:text-foreground transition-all">
                                    "{testimonial.quote}"
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="font-black text-2xl">{testimonial.name}</div>
                                    <Badge variant="secondary" className="px-3 py-1 font-bold">
                                        {testimonial.role}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* FOOTER CTA */}
            <section className="max-w-4xl mx-auto px-4 py-20 text-center">
                <div className="bg-gradient-to-r from-slate-900 to-gray-900 rounded-4xl p-12 lg:p-20 shadow-2xl text-white backdrop-blur-xl border border-slate-700/50">
                    <Volleyball className="w-24 h-24 mx-auto mb-8 text-emerald-400 drop-shadow-2xl animate-bounce" />
                    <h2 className="text-4xl lg:text-5xl font-black mb-6">
                        Prêt à <span className="text-emerald-400">gagner</span> ?
                    </h2>
                    <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto">
                        Rejoignez 1.2K parieurs. Pots live, IA précise, gains MoMo.
                    </p>
                    <Button size="lg" className="px-12 h-16 text-xl shadow-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 font-bold">
                        <Link href="/pots">
                            Jouer Gratuitement ⚽
                        </Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}