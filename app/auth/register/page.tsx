"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useTheme } from "@/components/layout/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User, Phone, Mail, Lock, ShieldCheck, Volleyball, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Register() {
  const router = useRouter();
  const { theme } = useTheme();
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1: Nom/Phone, 2: Email/MDP

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1️⃣ API Register
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erreur inscription");
        setLoading(false);
        return;
      }

      // 2️⃣ Auto-login NextAuth
      const result = await signIn("credentials", {
        redirect: false,
        phone: form.phone,
        password: form.password,
      });

      if (result?.error) {
        setError("Erreur connexion auto");
        setLoading(false);
        return;
      }

      // 3️⃣ Redirection
      router.push("/account");
    } catch (err: any) {
      setError("Erreur serveur");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-emerald-50 via-slate-50 to-blue-50 dark:from-slate-900 dark:via-gray-900/50 dark:to-emerald-900/20">

        {/* Hero Image */}
        <div className="hidden lg:flex items-center justify-center relative overflow-hidden min-h-screen">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 via-blue-500/30 to-purple-500/30 animate-pulse" />
          <img
              src="/images/register-football.jpg"
              alt="Rejoignez PronoCrew"
              className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative z-10 text-center px-12 max-w-2xl mx-auto">
            <div className="w-32 h-32 bg-white/30 rounded-3xl flex items-center justify-center mx-auto mb-12 backdrop-blur-xl shadow-2xl border border-white/50">
              <Users className="w-20 h-20 text-emerald-400 drop-shadow-2xl animate-pulse" />
            </div>
            <h1 className="text-6xl font-black text-white mb-8 drop-shadow-2xl leading-tight">
              Rejoignez<br />1.2k Joueurs
            </h1>
            <p className="text-2xl text-white/95 font-light mb-12 drop-shadow-lg leading-relaxed">
              Inscrivez-vous en 30s et commencez à gagner des XAF
            </p>
            <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-2xl">
              <div className="flex items-center justify-center gap-4 text-emerald-100 text-xl font-bold mb-2">
                <ShieldCheck className="w-8 h-8" />
                Gratuit · Sécurisé · MTN MoMo
              </div>
              <div className="text-emerald-50 text-lg grid grid-cols-3 gap-4">
                <div>78% IA</div>
                <div>24 Pots</div>
                <div>2.5M XAF</div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="flex items-center justify-center min-h-screen p-6 lg:p-12">
          <Card className="w-full max-w-lg shadow-2xl border-0 bg-card/95 backdrop-blur-2xl dark:bg-card/85">
            <CardHeader className="text-center space-y-3 pb-10">
              <Link href="/" className="inline-block">
                <img
                    src={theme === "dark" ? "/images/logo-dark.png" : "/images/logo.png"}
                    alt="PronoCrew"
                    className="h-24 w-auto mx-auto drop-shadow-2xl"
                />
              </Link>
              <div>
                <CardTitle className="text-4xl font-black bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Créer Compte
                </CardTitle>
                <CardDescription className="text-xl text-muted-foreground font-medium">
                  Rejoignez la communauté en 30 secondes
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              {error && (
                  <div className="p-5 bg-destructive/10 border-2 border-destructive/20 rounded-2xl text-destructive text-center font-semibold shadow-lg animate-pulse backdrop-blur-sm">
                    {error}
                  </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Étape 1: Nom + Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Nom complet
                    </label>
                    <Input
                        placeholder="Julio Mbah"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="h-14 text-lg rounded-2xl border-2 shadow-sm focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                        disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Téléphone (+237)
                    </label>
                    <Input
                        type="tel"
                        placeholder="69 12 34 56"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="h-14 text-lg rounded-2xl border-2 shadow-sm focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                        disabled={loading}
                    />
                  </div>
                </div>

                {/* Étape 2: Email + Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email (optionnel)
                    </label>
                    <Input
                        type="email"
                        placeholder="julio@pronocrew.cm"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="h-14 text-lg rounded-2xl border-2 shadow-sm focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                        disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Mot de passe
                    </label>
                    <Input
                        type="password"
                        placeholder="8+ caractères forts"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="h-14 text-lg rounded-2xl border-2 shadow-sm focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                        disabled={loading}
                    />
                  </div>
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    size="lg"
                    className="w-full h-16 text-xl font-black rounded-3xl shadow-2xl hover:shadow-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 border-2 border-emerald-600/50 backdrop-blur-sm"
                    disabled={loading}
                >
                  {loading ? (
                      <>
                        <Loader2 className="w-8 h-8 mr-3 animate-spin" />
                        Création...
                      </>
                  ) : (
                      <>
                        <ShieldCheck className="w-8 h-8 mr-3" />
                        S'inscrire Gratuitement
                      </>
                  )}
                </Button>
              </form>

              {/* Liens */}
              <div className="pt-8 border-t border-border/50 space-y-4">
                <div className="text-center text-sm text-muted-foreground p-4 bg-muted/50 rounded-2xl backdrop-blur-sm">
                  <Volleyball className="w-6 h-6 inline mr-2 text-emerald-500" />
                  Inscription sécurisée · MTN MoMo vérifié
                </div>
                <div className="flex items-center justify-center gap-4 pt-4">
                  <Link
                      href="/auth/login"
                      className="text-sm px-6 py-3 border-2 border-muted rounded-2xl hover:border-primary hover:text-primary hover:bg-primary/5 font-medium transition-all px-8"
                  >
                    Déjà inscrit?
                  </Link>
                  <Link
                      href="/auth/forgot-password"
                      className="text-sm px-6 py-3 bg-gradient-to-r from-slate-500 to-gray-600 text-white rounded-2xl hover:from-slate-600 font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    Mot de passe?
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}