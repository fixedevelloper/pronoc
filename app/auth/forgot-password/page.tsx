"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/components/layout/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, ShieldCheck, Volleyball, CheckCircle2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export default function ForgotPassword() {
  const { data: session } = useSession();
  const router = useRouter();
  const { theme } = useTheme();
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  if (session) {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      setError("Entrez votre numéro ou email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forget-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur envoi email");
      } else {
        setSent(true);
      }
    } catch (err: any) {
      setError("Erreur serveur");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-blue-50 dark:from-gray-900 dark:via-slate-900/50 dark:to-emerald-900/20">

        {/* Hero */}
        <div className="hidden lg:flex items-center justify-center relative overflow-hidden min-h-screen">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/40 via-blue-400/40 to-purple-400/40 backdrop-blur-sm" />
          <img
              src="/images/forgot-password-football.jpg"
              alt="Récupérez votre accès"
              className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative z-10 text-center px-12 max-w-xl mx-auto">
            <div className="w-28 h-28 bg-white/30 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-xl shadow-2xl border-4 border-white/50">
              <Mail className="w-16 h-16 text-white/90 drop-shadow-2xl" />
            </div>
            <h1 className="text-6xl font-black text-white mb-8 drop-shadow-2xl bg-gradient-to-r from-emerald-300 to-blue-300 bg-clip-text text-transparent leading-tight">
              Récupérez<br />Votre Accès
            </h1>
            <p className="text-2xl text-white/95 font-light mb-12 drop-shadow-lg leading-relaxed max-w-lg mx-auto">
              Lien de réinitialisation envoyé en 10s sur votre téléphone
            </p>
            <div className="grid grid-cols-3 gap-6 text-center text-emerald-100 text-xl font-bold">
              <div className="p-4 bg-white/20 backdrop-blur rounded-2xl">
                <ShieldCheck className="w-12 h-12 mx-auto mb-2 text-emerald-300" />
                Sécurisé
              </div>
              <div className="p-4 bg-white/20 backdrop-blur rounded-2xl">
                <Mail className="w-12 h-12 mx-auto mb-2 text-blue-300" />
                Instantané
              </div>
              <div className="p-4 bg-white/20 backdrop-blur rounded-2xl">
                <Volleyball className="w-12 h-12 mx-auto mb-2 text-purple-300" />
                Football
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="flex items-center justify-center min-h-screen p-6 lg:p-12">
          <AnimatePresence mode="wait">
            <motion.div
                key={sent ? "success" : "form"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
            >
              <Card className="w-full max-w-lg shadow-2xl border-0 bg-card/95 backdrop-blur-2xl dark:bg-card/85">
                <CardHeader className="text-center space-y-4 pb-12">
                  <Link href="/" className="inline-block">
                    <img
                        src={theme === "dark" ? "/images/logo-dark.png" : "/images/logo.png"}
                        alt="PronoCrew"
                        className="h-24 w-auto mx-auto drop-shadow-2xl"
                    />
                  </Link>
                  {!sent ? (
                      <>
                        <CardTitle className="text-4xl font-black bg-gradient-to-r from-gray-900 to-emerald-600 dark:from-white dark:to-emerald-400 bg-clip-text text-transparent">
                          Mot de Passe Oublié
                        </CardTitle>
                        <CardDescription className="text-xl text-muted-foreground font-medium leading-relaxed">
                          Entrez votre numéro ou email pour recevoir un lien de réinitialisation
                        </CardDescription>
                      </>
                  ) : (
                      <>
                        <CardTitle className="text-4xl font-black text-emerald-600 dark:text-emerald-400">
                          Lien Envoyé !
                        </CardTitle>
                        <CardDescription className="text-xl font-medium text-emerald-700 dark:text-emerald-400">
                          Vérifiez votre SMS ou email pour le lien de réinitialisation
                        </CardDescription>
                      </>
                  )}
                </CardHeader>

                <CardContent className="space-y-8">
                  {!sent ? (
                      <>
                        {error && (
                            <div className="p-6 bg-destructive/10 border-2 border-destructive/30 rounded-3xl text-destructive text-center font-semibold shadow-lg backdrop-blur-sm animate-pulse">
                              {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="space-y-3">
                            <label className="text-sm font-bold text-foreground flex items-center gap-2">
                              <Mail className="w-5 h-5" />
                              Numéro ou Email
                            </label>
                            <Input
                                type="text"
                                placeholder="69 12 34 56 ou user@pronocrew.cm"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                className="h-16 text-xl rounded-3xl border-2 shadow-lg focus-visible:ring-emerald-500 focus-visible:border-emerald-500 backdrop-blur-sm"
                                disabled={loading}
                            />
                          </div>

                          <Button
                              type="submit"
                              size="lg"
                              className="w-full h-16 text-xl font-black rounded-3xl shadow-2xl hover:shadow-3xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 border-2 border-emerald-600/50 backdrop-blur-sm"
                              disabled={loading}
                          >
                            {loading ? (
                                <>
                                  <Loader2 className="w-8 h-8 mr-3 animate-spin" />
                                  Envoi SMS...
                                </>
                            ) : (
                                <>
                                  <Mail className="w-8 h-8 mr-3" />
                                  Envoyer Lien
                                </>
                            )}
                          </Button>
                        </form>
                      </>
                  ) : (
                      <div className="space-y-8 pt-8">
                        <div className="flex items-center justify-center w-32 h-32 mx-auto bg-emerald-500/20 rounded-3xl backdrop-blur-xl border-4 border-emerald-500/30">
                          <CheckCircle2 className="w-20 h-20 text-emerald-500 drop-shadow-lg animate-bounce" />
                        </div>
                        <div className="text-center space-y-4">
                          <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                            Parfait !
                          </h3>
                          <p className="text-lg text-muted-foreground leading-relaxed">
                            Un lien de réinitialisation a été envoyé sur votre téléphone.
                            Il expire dans 15 minutes.
                          </p>
                        </div>
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full h-14 rounded-3xl border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-500/10 font-semibold shadow-lg"
                        >
                          <Link href="/auth/login">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Retour Connexion
                          </Link>
                        </Button>
                      </div>
                  )}

                  <div className="pt-12 border-t border-border/50 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                      <span>Sécurisé · SMS instantané · MTN MoMo vérifié</span>
                    </div>
                    <Link
                        href="/auth/login"
                        className="inline-flex items-center gap-2 text-lg font-semibold text-primary hover:text-primary/80 transition-colors px-6 py-3 rounded-2xl hover:bg-primary/5"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Retour à la Connexion
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
  );
}