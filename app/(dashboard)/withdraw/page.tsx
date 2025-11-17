"use client";
import { useState } from "react";
import AccountBalance from "../../components/layout/AccountBalance";
import AccountNavigation from "../../components/layout/AccountNavigation";

export default function WithdrawPage() {
    const [form, setForm] = useState({
        amount: "",
        method: "momo", // ou "om", "carte"
        country: "CM",   // par défaut Cameroun
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const countries = [
        { code: "CM", name: "Cameroun" },
        { code: "SN", name: "Sénégal" },
        { code: "CI", name: "Côte d'Ivoire" },
        { code: "FR", name: "France" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.amount || parseFloat(form.amount) <= 0) {
            setError("Veuillez entrer un montant valide");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/withdraw`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (data.error) {
                setError(data.error);
            } else {
                setSuccess("Retrait demandé avec succès !");
                setForm({ ...form, amount: "" });
            }
        } catch (err: any) {
            console.error(err);
            setError("Impossible de se connecter au serveur");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-8xl mx-auto mt-8 px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* ---------------- SIDEBAR ---------------- */}
            <div className="md:col-span-1 space-y-6">
                <AccountBalance />
                <AccountNavigation />
            </div>

            {/* COLONNE DROITE → Formulaire */}
            <div className="md:col-span-2">
                <div className="w-full max-w-md space-y-6 rounded-2xl p-8 shadow-xl bg-white dark:bg-gray-900">

                    <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
                        Retrait
                    </h2>

                    <p className="text-center text-gray-600 dark:text-gray-300">
                        Choisissez le montant, le pays et la méthode pour retirer votre argent.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Montant */}
                        <input
                            type="number"
                            placeholder="Montant à retirer"
                            value={form.amount}
                            onChange={(e) => setForm({ ...form, amount: e.target.value })}
                            className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg focus:ring-2 focus:ring-[#014d74] outline-none text-gray-800 dark:text-gray-100"
                        />

                        {/* Pays */}
                        <select
                            value={form.country}
                            onChange={(e) => setForm({ ...form, country: e.target.value })}
                            className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg focus:ring-2 focus:ring-[#014d74] outline-none text-gray-800 dark:text-gray-100"
                        >
                            {countries.map((c) => (
                                <option key={c.code} value={c.code}>
                                    {c.name}
                                </option>
                            ))}
                        </select>

                        {/* Méthode de retrait */}
                        <select
                            value={form.method}
                            onChange={(e) => setForm({ ...form, method: e.target.value })}
                            className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg focus:ring-2 focus:ring-[#014d74] outline-none text-gray-800 dark:text-gray-100"
                        >
                            <option value="momo">Mobile Money</option>
                            <option value="om">Orange Money</option>
                            <option value="bank">Virement bancaire</option>
                        </select>

                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        {success && <p className="text-green-500 text-sm text-center">{success}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-lg text-white font-semibold shadow transition ${
                                loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#014d74] hover:bg-[#013d5a]"
                            }`}
                        >
                            {loading ? "Traitement..." : "Retirer"}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}
