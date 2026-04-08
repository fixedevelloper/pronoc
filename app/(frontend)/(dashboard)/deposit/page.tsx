"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, CreditCard, Smartphone, Banknote, MapPin, Phone, DollarSign, Zap } from "lucide-react";
import AccountBalance from "../../../../components/layout/AccountBalance";
import AccountNavigation from "../../../../components/layout/AccountNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useSnackbar } from "notistack";
import axiosServices from "../../../utils/axiosServices";
import {cn} from "../../../utils/utils";

interface DepositForm {
    phone: string;
    amount: string;
    paymentMethod: string;
    country: string;
}

interface Country {
    code: string;
    name: string;
    prefix: string;
    methods: Array<{
        value: string;
        label: string;
        icon: any;
        color: string;
        min_amount: number;
        max_amount: number;
    }>;
}

export default function DepositPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    const [form, setForm] = useState<DepositForm>({
        phone: "",
        amount: "",
        paymentMethod: "",
        country: "CM",
    });
    const [loading, setLoading] = useState(false);
    const [balance, setBalance] = useState(0);
    const [currentCountry, setCurrentCountry] = useState<Country | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        } else if (status === "authenticated" && session?.user?.balance) {
            setBalance(Number(session.user.balance));
        }
    }, [status, session, router]);

    // ✅ Tous les pays + méthodes spécifiques
    const countries: Country[] = [
        // 🇨🇲 CAMEROUN
        {
            code: "CM",
            name: "Cameroun 🇨🇲",
            prefix: "+237",
            methods: [
                { value: "mtn_momo", label: "MTN MoMo", icon: Smartphone, color: "from-purple-500 to-pink-500", min_amount: 1000, max_amount: 500000 },
                { value: "orange_money", label: "Orange Money", icon: Smartphone, color: "from-orange-500 to-red-500", min_amount: 1000, max_amount: 500000 },
                { value: "wave", label: "Wave", icon: Smartphone, color: "from-blue-500 to-cyan-500", min_amount: 500, max_amount: 100000 },
                { value: "card", label: "Carte Bancaire", icon: CreditCard, color: "from-indigo-500 to-blue-500", min_amount: 5000, max_amount: 1000000 },
            ]
        },

        // 🇨🇬 CONGO
        {
            code: "CG",
            name: "Congo 🇨🇬",
            prefix: "+242",
            methods: [
                { value: "airtel_money", label: "Airtel Money", icon: Smartphone, color: "from-orange-500 to-red-500", min_amount: 1000, max_amount: 300000 },
                { value: "mtn_momo", label: "MTN MoMo", icon: Smartphone, color: "from-purple-500 to-pink-500", min_amount: 1000, max_amount: 300000 },
                { value: "bank_transfer", label: "Virement", icon: Banknote, color: "from-emerald-500 to-green-500", min_amount: 5000, max_amount: 500000 },
                { value: "card", label: "Carte", icon: CreditCard, color: "from-indigo-500 to-blue-500", min_amount: 5000, max_amount: 500000 },
            ]
        },

        // 🇨🇩 RDC
        {
            code: "CD",
            name: "RDC 🇨🇩",
            prefix: "+243",
            methods: [
                { value: "mtn_momo", label: "MTN MoMo", icon: Smartphone, color: "from-purple-500 to-pink-500", min_amount: 1000, max_amount: 500000 },
                { value: "airtel_money", label: "Airtel Money", icon: Smartphone, color: "from-orange-500 to-red-500", min_amount: 1000, max_amount: 300000 },
                { value: "vodacom_m_pesa", label: "M-Pesa Vodacom", icon: Smartphone, color: "from-green-500 to-emerald-500", min_amount: 1000, max_amount: 300000 },
                { value: "card", label: "Carte Bancaire", icon: CreditCard, color: "from-indigo-500 to-blue-500", min_amount: 5000, max_amount: 500000 },
            ]
        },

        // 🇬🇦 GABON
        {
            code: "GA",
            name: "Gabon 🇬🇦",
            prefix: "+241",
            methods: [
                { value: "airtel_money", label: "Airtel Money", icon: Smartphone, color: "from-orange-500 to-red-500", min_amount: 1000, max_amount: 300000 },
                { value: "moov_money", label: "Moov Money", icon: Smartphone, color: "from-teal-500 to-cyan-500", min_amount: 1000, max_amount: 300000 },
                { value: "bank_transfer", label: "Virement", icon: Banknote, color: "from-emerald-500 to-green-500", min_amount: 5000, max_amount: 500000 },
                { value: "card", label: "Carte", icon: CreditCard, color: "from-indigo-500 to-blue-500", min_amount: 5000, max_amount: 500000 },
            ]
        },

        // Autres pays...
        {
            code: "SN",
            name: "Sénégal 🇸🇳",
            prefix: "+221",
            methods: [
                { value: "orange_money", label: "Orange Money", icon: Smartphone, color: "from-orange-500 to-red-500", min_amount: 1000, max_amount: 500000 },
                { value: "wave", label: "Wave", icon: Smartphone, color: "from-blue-500 to-cyan-500", min_amount: 500, max_amount: 100000 },
                { value: "free_money", label: "Free Money", icon: Smartphone, color: "from-purple-500 to-violet-500", min_amount: 1000, max_amount: 200000 },
                { value: "card", label: "Carte", icon: CreditCard, color: "from-indigo-500 to-blue-500", min_amount: 5000, max_amount: 500000 },
            ]
        },
        {
            code: "CI",
            name: "Côte d'Ivoire 🇨🇮",
            prefix: "+225",
            methods: [
                { value: "orange_money", label: "Orange Money", icon: Smartphone, color: "from-orange-500 to-red-500", min_amount: 1000, max_amount: 500000 },
                { value: "mtn_momo", label: "MTN MoMo", icon: Smartphone, color: "from-purple-500 to-pink-500", min_amount: 1000, max_amount: 500000 },
                { value: "wave", label: "Wave", icon: Smartphone, color: "from-blue-500 to-cyan-500", min_amount: 500, max_amount: 100000 },
                { value: "card", label: "Carte Bancaire", icon: CreditCard, color: "from-indigo-500 to-blue-500", min_amount: 5000, max_amount: 1000000 },
            ]
        },
    ];

    useEffect(() => {
        const country = countries.find(c => c.code === form.country);
        setCurrentCountry(country || null);

        if (country && country.methods.length > 0) {
            setForm(prev => ({ ...prev, paymentMethod: country.methods[0].value }));
        }
    }, [form.country]);

    const handleInputChange = (field: keyof DepositForm, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        const amountNum = parseFloat(form.amount);
        const currentMethod = currentCountry?.methods.find(m => m.value === form.paymentMethod);

        if (!form.phone.trim()) {
            enqueueSnackbar("📱 Numéro de téléphone requis", { variant: "warning" });
            return false;
        }

        if (!form.amount || amountNum <= 0) {
            enqueueSnackbar("💰 Montant invalide", { variant: "warning" });
            return false;
        }

        if (currentMethod) {
            if (amountNum < currentMethod.min_amount) {
                enqueueSnackbar(`⚠️ Minimum ${currentMethod.min_amount.toLocaleString()} XAF`, { variant: "warning" });
                return false;
            }
            if (amountNum > currentMethod.max_amount) {
                enqueueSnackbar(`⚠️ Maximum ${currentMethod.max_amount.toLocaleString()} XAF`, { variant: "warning" });
                return false;
            }
        }

        return true;
    };

    const formatPhone = () => {
        const country = countries.find(c => c.code === form.country);
        const prefix = country?.prefix || "+237";
        return `${prefix} ${form.phone.replace(/\s+/g, ' ').trim()}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const payload = {
                ...form,
                amount: parseFloat(form.amount),
                phone_formatted: formatPhone(),
                country: currentCountry?.name,
                operator: currentCountry?.methods.find(m => m.value === form.paymentMethod)?.label
            };

            const response = await axiosServices.post("/api/recharges", payload);

            const { reference, payment_url } = response.data.data;

            if (reference && payment_url) {
                localStorage.setItem("deposit_reference", reference);

                enqueueSnackbar("✅ Redirection paiement...", { variant: "success" });

                // 🔥 REDIRECTION
                window.location.href = payment_url;

            } else {
                throw new Error("Référence ou URL paiement manquante");
            }

        } catch (err: any) {
            console.error("Deposit error:", err);
            const message = err.response?.data?.message || "❌ Erreur dépôt";
            enqueueSnackbar(message, { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-6" />
                    <p className="text-2xl font-bold text-emerald-800">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50/30 to-blue-50/20 py-12 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* SIDEBAR */}
                <div className="lg:col-span-1 space-y-8 sticky top-8 self-start">
                    <AccountBalance />
                    <AccountNavigation />
                </div>

                {/* MAIN */}
                <div className="lg:col-span-3 space-y-8">

                    {/* HEADER */}
                    <Card className="border-0 shadow-2xl backdrop-blur-xl overflow-hidden">
                        <CardContent className="p-0">
                            <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-blue-600 p-8 lg:p-12 text-white">
                                <div className="max-w-4xl mx-auto">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => router.back()}
                                        className="mb-6 text-white hover:bg-white/20"
                                    >
                                        <ArrowLeft className="w-5 h-5 mr-2" />
                                        Retour
                                    </Button>

                                    <h1 className="text-4xl lg:text-5xl font-black mb-4 drop-shadow-lg">
                                        Dépôt Instantané
                                    </h1>
                                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between text-xl opacity-95">
                                        <p>Solde actuel: <strong className="text-2xl">{balance.toLocaleString()} XAF</strong></p>
                                        {currentCountry && (
                                            <Badge className="text-lg px-6 py-3 font-bold shadow-lg bg-white/20 backdrop-blur-sm border-white/30">
                                                {currentCountry.name}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* FORMULAIRE */}
                    <Card className="border-0 shadow-2xl max-w-2xl mx-auto backdrop-blur-xl bg-white/95">
                        <CardContent className="p-0">
                            <div className="p-8 lg:p-12 space-y-8">

                                {/* PAYS */}
                                <div>
                                    <Label className="text-xl font-bold text-slate-900 mb-4 block flex items-center gap-2">
                                        <MapPin className="w-6 h-6" />
                                        Votre pays
                                    </Label>
                                    <Select
                                        value={form.country ?? ""}
                                        onValueChange={(value:any) => handleInputChange("country", value)}
                                    >
                                        <SelectTrigger className="h-20 text-2xl border-2 border-slate-200/50 hover:border-emerald-300 focus:border-emerald-400 shadow-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="p-4 max-h-[400px]">
                                            {countries.map(country => (
                                                <SelectItem
                                                    key={country.code}
                                                    value={country.code}
                                                    className="text-xl py-6 hover:bg-gradient-to-r hover:from-emerald-50/50 to-blue-50/50 rounded-2xl shadow-sm"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-2xl font-bold">{country.name}</span>
                                                        <span className="text-lg opacity-75 ml-auto">({country.prefix})</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* MONTANT */}
                                <div>
                                    <Label className="text-xl font-bold text-slate-900 mb-4 block flex items-center gap-2">
                                        <DollarSign className="w-6 h-6" />
                                        Montant à déposer (XAF)
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            placeholder="Ex: 5000"
                                            value={form.amount}
                                            onChange={(e) => handleInputChange("amount", e.target.value)}
                                            className="h-20 text-3xl pl-16 border-2 border-slate-200/50 hover:border-emerald-300 focus:border-emerald-400 shadow-xl pr-20"
                                            min={currentCountry?.methods[0]?.min_amount || 500}
                                            step="500"
                                        />
                                        <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 text-slate-400" />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm text-slate-500 font-bold bg-slate-100/70 px-4 py-2 rounded-xl">
                                            <Zap className="w-4 h-4" />
                                            Instantané
                                        </div>
                                    </div>
                                    {currentCountry && (
                                        <p className="text-sm text-slate-600 mt-3 flex items-center gap-2">
                                            💡 Limites: {currentCountry.methods[0]?.min_amount?.toLocaleString()} - {currentCountry.methods[0]?.max_amount?.toLocaleString()} XAF
                                        </p>
                                    )}
                                </div>

                                {/* TÉLÉPHONE */}
                                <div>
                                    <Label className="text-xl font-bold text-slate-900 mb-4 block flex items-center gap-2">
                                        <Phone className="w-6 h-6" />
                                        Numéro de téléphone
                                    </Label>
                                    <Input
                                        type="tel"
                                        placeholder="69 12 34 56"
                                        value={form.phone}
                                        onChange={(e) => handleInputChange("phone", e.target.value.replace(/\D/g, ''))}
                                        className="h-20 text-2xl border-2 border-slate-200/50 hover:border-blue-300 focus:border-blue-400 shadow-xl"
                                        maxLength={12}
                                    />
                                    <div className="mt-3 p-4 bg-slate-50/70 rounded-2xl backdrop-blur-sm border border-slate-200/50">
                                        <p className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                            📞 <span>{formatPhone()}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* MÉTHODES PAR PAYS */}
                                {currentCountry && (
                                    <div>
                                        <Label className="text-xl font-bold text-slate-900 mb-6 block">
                                            Opérateur / Méthode
                                        </Label>
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                            {currentCountry.methods.map(({ value, label, icon: Icon, color, min_amount, max_amount }) => {
                                                const amountNum = parseFloat(form.amount);
                                                const isValidAmount = amountNum >= min_amount && amountNum <= max_amount;
                                                const isActive = form.paymentMethod === value;

                                                return (
                                                    <Button
                                                        key={value}
                                                        variant={isActive ? "default" : "outline"}
                                                        className={cn(
                                                            "h-28 flex flex-col gap-3 p-6 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden border-2",
                                                            isActive ? `bg-gradient-to-br ${color} text-white shadow-2xl border-transparent` :
                                                                isValidAmount ? "hover:shadow-xl hover:border-transparent hover:bg-gradient-to-br hover:${color} hover:text-white" :
                                                                    "opacity-50 cursor-not-allowed border-slate-300"
                                                        )}
                                                        onClick={() => handleInputChange("paymentMethod", value)}
                                                        disabled={!isValidAmount}
                                                    >
                                                        {/* Icon */}
                                                        <div className={cn(
                                                            "w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg p-4 mx-auto transition-all",
                                                            isActive ? "bg-white/20 backdrop-blur-sm scale-110 shadow-white/20" :
                                                                isValidAmount ? "bg-white/60 hover:scale-105 hover:shadow-md" : "bg-slate-100"
                                                        )}>
                                                            <Icon className="w-8 h-8" />
                                                        </div>

                                                        {/* Label */}
                                                        <span className="font-bold text-lg leading-tight">{label}</span>

                                                        {/* Limits */}
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-xs px-3 py-1 mx-auto shadow-sm"
                                                        >
                                                            {min_amount.toLocaleString()} - {max_amount.toLocaleString()}
                                                        </Badge>

                                                        {/* Active Check */}
                                                        {isActive && (
                                                            <div className="absolute -top-2 -right-2 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl animate-ping">
                                                                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                                                                    ✓
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* SUBMIT */}
                                <Button
                                    type="submit"
                                    onClick={handleSubmit}
                                    disabled={loading || !form.paymentMethod || !form.phone || parseFloat(form.amount) === 0 || !currentCountry}
                                    size="lg"
                                    className="w-full h-20 text-2xl font-black shadow-2xl hover:shadow-3xl bg-gradient-to-r from-emerald-600 via-green-600 to-blue-600 hover:from-emerald-700 hover:via-green-700 hover:to-blue-700 text-white disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Zap className="w-8 h-8 mr-4 animate-pulse" />
                                            Génération paiement...
                                        </>
                                    ) : (
                                        <>
                                            💰 Déposer {parseFloat(form.amount || "0").toLocaleString()} XAF
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}