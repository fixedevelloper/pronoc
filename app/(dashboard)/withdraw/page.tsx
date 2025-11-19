"use client";
import {useEffect, useState} from "react";
import AccountBalance from "../../components/layout/AccountBalance";
import AccountNavigation from "../../components/layout/AccountNavigation";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import axiosServices from "../../utils/axiosServices";
import {useSnackbar} from "notistack";

export default function WithdrawPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [form, setForm] = useState({
        phone: "",
        amount: "",
        method: "momo", // ou "om", "carte"
        country: "CM",   // par défaut Cameroun
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { enqueueSnackbar } = useSnackbar();
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return <p>Chargement...</p>;
    }

    if (status === "unauthenticated") {
        return null; // redirection en cours
    }

    const countries = [
        { code: "CM", name: "Cameroun" },
        { code: "SN", name: "Sénégal" },
        { code: "CI", name: "Côte d'Ivoire" },
        { code: "FR", name: "France" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // ✔ Validation
        if (!form.amount || parseFloat(form.amount) <= 0) {
            enqueueSnackbar("Veuillez entrer un montant valide", { variant: "warning" });
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            // ❗ NE PAS utiliser JSON.stringify → axios le fait déjà
            const response = await axiosServices.post("/api/pay/withdraw", form);

            const data = response.data;

            if (data.referenceId) {
                enqueueSnackbar("✅ Retrait effectué avec succès", { variant: "success" });

                // ⚠ Mise à jour du solde dans NextAuth (corrigée)
                if (session?.user) {
                    session.user.balance = data.balance;
                }

                router.push("/account");
            } else {
                throw new Error("Aucune référence de paiement reçue.");
            }
        } catch (err: any) {
            console.error(err);

            // ✔ Correction des messages d’erreur
            enqueueSnackbar("❌ Retrait échoué", { variant: "error" });

            setError(err.response?.data?.message || "Impossible de se connecter au serveur");
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
                <div className="w-full max-w-2xl space-y-6 rounded-2xl p-8 shadow-xl bg-card">

                    <h2 className="text-3xl font-bold text-center text-theme">
                        Retrait
                    </h2>

                    <p className="text-center text-theme">
                        Choisissez le montant, le pays et la méthode pour retirer votre argent.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Pays */}
                        <select
                            value={form.country}
                            onChange={(e) => setForm({ ...form, country: e.target.value })}
                            className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50  p-3 rounded-lg focus:ring-2 focus:ring-[#014d74] outline-none text-gray-800"
                        >
                            {countries.map((c) => (
                                <option key={c.code} value={c.code}>
                                    {c.name}
                                </option>
                            ))}
                        </select>

                        {/* Montant */}
                        <input
                            type="number"
                            placeholder="Montant à retirer"
                            value={form.amount}
                            onChange={(e) => setForm({ ...form, amount: e.target.value })}
                            className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 p-3 rounded-lg focus:ring-2 focus:ring-[#014d74] outline-none text-gray-800"
                        />

                        {/* Phone */}
                        <input
                            type="text"
                            placeholder="Telephone"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 p-3 rounded-lg focus:ring-2 focus:ring-[#014d74] outline-none text-gray-800"
                        />
                        {/* Méthode de retrait */}
                        <select
                            value={form.method}
                            onChange={(e) => setForm({ ...form, method: e.target.value })}
                            className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 p-3 rounded-lg focus:ring-2 focus:ring-[#014d74] outline-none text-gray-800"
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
