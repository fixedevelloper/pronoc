"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/components/layout/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Phone, Lock, Volleyball, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme } = useTheme();
  const [form, setForm] = useState({ phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect si connecté
  useEffect(() => {
    if (session) {
      router.push("/pots");
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.phone || !form.password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      phone: form.phone,
      password: form.password,
    });

    if (res?.error) {
      setError("Numéro ou mot de passe incorrect");
    } else {
      router.push("/pots");
    }

    setLoading(false);
  };

  if (status === "loading") {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
        </div>
    );
  }

  return (
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-slate-50 via-emerald-50/50 to-blue-50 dark:from-gray-900 dark:via-slate-900/50 dark:to-gray-800">

        {/* Colonne Image (Mobile: Logo centré) */}
        <div className="hidden lg:flex items-center justify-center relative overflow-hidden min-h-screen">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-blue-500/20 to-purple-500/20" />
          <img
              src="/images/login-football.jpg" // Image stade/prono
              alt="PronoCrew Football"
              className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative z-10 text-center px-8 max-w-2xl mx-auto">
            <div className="w-28 h-28 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm shadow-2xl">
              <Volleyball className="w-16 h-16 text-white drop-shadow-lg animate-bounce" />
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-white mb-6 drop-shadow-2xl leading-tight">
              PronoCrew
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 font-light mb-8 drop-shadow-lg leading-relaxed">
              Prédictions IA précises <br /> Paris mutuels Cameroun
            </p>
            <div className="text-emerald-100 text-lg font-semibold">
              <ShieldCheck className="w-6 h-6 inline mr-2" />
              78% précision IA · 24 pots actifs · 2.5M XAF
            </div>
          </div>
        </div>

        {/* Formulaire (Mobile: Fullscreen) */}
        <div className="flex items-center justify-center min-h-screen p-4 lg:p-12">
          <Card className="w-full max-w-md shadow-2xl border-0 bg-card/90 backdrop-blur-xl dark:bg-card/80">
            <CardHeader className="text-center space-y-2 pb-8">
              <Link href="/" className="inline-block">
                <img
                    src={theme === "dark" ? "/images/logo-dark.png" : "/images/logo.png"}
                    alt="PronoCrew"
                    className="h-20 w-auto mx-auto drop-shadow-lg"
                />
              </Link>
              <div>
                <CardTitle className="text-3xl font-black bg-gradient-to-r from-gray-900 via-emerald-600 to-gray-900 dark:from-white dark:via-emerald-400 bg-clip-text text-transparent">
                  Connexion Rapide
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  Accédez aux pronostics et pots en 5s
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                  <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-2xl text-destructive text-center font-medium animate-pulse">
                    {error}
                  </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Numéro téléphone (+237)
                  </label>
                  <Input
                      type="tel"
                      placeholder="69 12 34 56"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="h-14 text-lg rounded-2xl border-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 shadow-sm"
                      disabled={loading}
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Mot de passe
                  </label>
                  <Input
                      type="password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="h-14 text-lg rounded-2xl border-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 shadow-sm"
                      disabled={loading}
                  />
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    className="w-full h-16 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 border-2 border-emerald-600/50"
                    disabled={loading}
                >
                  {loading ? (
                      <>
                        <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                        Connexion...
                      </>
                  ) : (
                      <>
                        <ShieldCheck className="w-6 h-6 mr-2" />
                        Se Connecter
                      </>
                  )}
                </Button>
              </form>

              {/* Liens */}
              <div className="pt-6 border-t border-border space-y-4">
                <div className="text-xs text-muted-foreground text-center">
                  🔒 Connexion sécurisée MTN MoMo
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <Link
                      href="/auth/forgot-password"
                      className="text-sm text-center py-3 px-4 border-2 border-muted rounded-xl hover:border-primary hover:text-primary hover:bg-primary/5 transition-all font-medium"
                  >
                    Mot de passe oublié?
                  </Link>
                  <Link
                      href="/auth/register"
                      className="text-sm text-center py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:shadow-lg font-semibold shadow-md transition-all"
                  >
                    S'inscrire
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}