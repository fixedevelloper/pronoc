"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {Button} from "@headlessui/react";
import {useTheme} from "../../components/layout/ThemeContext";

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (session) {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      phone: form.username,
      password: form.password,
    });

    if (res?.error) {
      setError("Identifiants incorrects");
    } else {
      router.push("/");
    }

    setLoading(false);
  };

  return (
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

        {/* COLONNE GAUCHE → Image */}
        <div className="hidden md:flex items-center justify-center relative overflow-hidden">
          <img
              src="/images/login.webp"
              alt="Connexion"
              className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="absolute text-center px-6">
            <h1 className="text-white text-5xl font-extrabold drop-shadow-lg">
              Easy Paris
            </h1>
            <p className="text-gray-200 mt-4 text-lg max-w-md mx-auto font-light">
              Connectez-vous pour rejoindre les pots et faire vos pronostics foot !
            </p>
          </div>
        </div>

        {/* COLONNE DROITE → Formulaire */}
        <div className="bg-card flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md space-y-6 rounded-2xl p-8 shadow-xl">

            {/* Logo */}
            <div className="flex justify-center">

              <img
                  src={theme === "dark" ? "/images/logo-dark.png" : "/images/logo.png"}
                  alt="PronoCrew Logo"
                  className="h-16 w-auto"
              />
            </div>

            <h2 className="text-3xl font-bold text-center text-gray-800 text-theme">
              Connexion
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              <input
                  type="text"
                  placeholder="Numéro de téléphone"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg focus:ring-2 focus:ring-[#014d74] outline-none text-gray-800 dark:text-gray-100"
              />

              <input
                  type="password"
                  placeholder="Mot de passe"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg focus:ring-2 focus:ring-[#014d74] outline-none text-gray-800 dark:text-gray-100"
              />

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg text-white font-semibold shadow transition ${
                      loading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-[#014d74] hover:bg-[#013d5a]"
                  }`}
              >
                {loading ? "Connexion..." : "Se connecter"}
              </button>

              <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mt-2">
                <Link
                    href="/auth/forgot-password"
                    className="text-[#014d74] hover:underline hover:text-[#013d5a]"
                >
                  Mot de passe oublié ?
                </Link>
                <Link
                    href="/auth/register"
                    className="text-[#014d74] font-semibold hover:underline hover:text-[#013d5a]"
                >
                  S’inscrire
                </Link>
              </div>

            </form>

          </div>
        </div>
      </div>

  );
}
