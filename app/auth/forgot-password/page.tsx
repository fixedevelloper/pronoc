"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {Button} from "@headlessui/react";
import {useTheme} from "../../components/layout/ThemeContext";

export default function ForgotPassword() {
  const { data: session } = useSession();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [form, setForm] = useState({ identifier: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (session) {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.identifier) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forget-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: form.identifier }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error || "Une erreur est survenue");
      } else {
        setSuccess("Un lien de réinitialisation a été envoyé !");
      }
    } catch (err: any) {
      console.error(err);
      setError("Impossible de se connecter au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

        {/* COLONNE GAUCHE → Image */}
        <div className="hidden md:flex items-center justify-center relative overflow-hidden">
          <img
              src="/images/login.webp"
              alt="Mot de passe oublié"
              className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="absolute text-center px-6">
            <h1 className="text-white text-5xl font-extrabold drop-shadow-lg">Prono crew</h1>
            <p className="text-gray-200 mt-4 text-lg max-w-md mx-auto font-light">
              Récupérez votre mot de passe et continuez à faire vos pronostics facilement.
            </p>
          </div>
        </div>

        {/* COLONNE DROITE → Formulaire */}
        <div className="bg-white dark:bg-gray-900 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md space-y-6 rounded-2xl p-8 shadow-xl">

            {/* Logo */}
            <Link href='/'>
              <img
                  src={theme === "dark" ? "/images/logo-dark.png" : "/images/logo.png"}
                  alt="PronoCrew Logo"
                  className="h-16 w-auto"
              />
            </Link>

            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
              Mot de passe oublié
            </h2>

            <p className="text-center text-gray-600 dark:text-gray-300">
              Entrez votre email ou numéro de téléphone pour réinitialiser votre mot de passe.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">

              <input
                  type="text"
                  placeholder="Email ou numéro de téléphone"
                  value={form.identifier}
                  onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg focus:ring-2 focus:ring-[#014d74] outline-none text-gray-800 dark:text-gray-100"
              />

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              {success && <p className="text-green-500 text-sm text-center">{success}</p>}

              <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg text-white font-semibold shadow transition ${
                      loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#014d74] hover:bg-[#013d5a]"
                  }`}
              >
                {loading ? "Envoi..." : "Réinitialiser le mot de passe"}
              </button>

              <div className="flex justify-center text-sm text-gray-700 dark:text-gray-300 mt-2">
                <Link
                    href="/auth/login"
                    className="text-[#014d74] font-semibold hover:underline hover:text-[#013d5a]"
                >
                  Retour à la connexion
                </Link>
              </div>

            </form>
          </div>
        </div>
      </div>
  );
}

