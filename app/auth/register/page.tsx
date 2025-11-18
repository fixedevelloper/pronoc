'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import {useTheme} from "../../components/layout/ThemeContext";

export default function Register() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { theme, toggleTheme } = useTheme();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erreur lors de l'inscription");
        setLoading(false);
        return;
      }
// 2️⃣ Connexion automatique via NextAuth credentials
    const result = await signIn("credentials", {
      redirect: false, // On gère la redirection nous-mêmes
      phone,
      password,
    });

    if (result?.error) {
      setError(result.error || "Erreur lors de la connexion automatique");
      setLoading(false);
      return;
    }

    // 3️⃣ Redirection après succès
    router.push("/account"); // Ou la page principale après login
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
              alt="Connexion"
              className="w-full h-full object-cover scale-105"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>

          {/* Texte */}
          <div className="absolute text-center px-6">
            <h1 className="text-white text-5xl font-extrabold drop-shadow-lg">
              Prono crew
            </h1>
            <p className="text-gray-200 mt-4 text-lg max-w-md mx-auto font-light">
              Rejoignez la plateforme la plus fun pour faire vos pronostics foot !
            </p>
          </div>
        </div>

        {/* COLONNE DROITE → Formulaire */}
        <div className="bg-card flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md space-y-6">
            <Link href='/'>
              <img
                  src={theme === "dark" ? "/images/logo-dark.png" : "/images/logo.png"}
                  alt="PronoCrew Logo"
                  className="h-16 w-auto"
              />
            </Link>
            <h2 className="text-3xl font-bold text-center text-gray-800">
              Créer un compte
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              <input
                  type="text"
                  placeholder="Nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50  p-3 rounded-lg focus:ring-2 focus:ring-[#014d74] outline-none text-gray-800"
              />

              <input
                  type="text"
                  placeholder="Numéro de téléphone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50  p-3 rounded-lg focus:ring-2 focus:ring-[#014d74] outline-none text-gray-800"
              />

              <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50  p-3 rounded-lg focus:ring-2 focus:ring-[#014d74] outline-none text-gray-800 "
              />

              <input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 p-3 rounded-lg focus:ring-2 focus:ring-[#014d74] outline-none text-gray-800"
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
                {loading ? "Inscription..." : "S'inscrire"}
              </button>

              <div className="text-center text-sm text-gray-700 dark:text-gray-300 mt-3">
                Déjà un compte ?{" "}
                <Link
                    href="/auth/login"
                    className="text-[#014d74] font-semibold hover:underline hover:text-[#013d5a]"
                >
                  Se connecter
                </Link>
              </div>

            </form>

          </div>
        </div>
      </div>

  );
}
