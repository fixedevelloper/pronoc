"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {ArrowLeft, CreditCard, Smartphone, Banknote, MapPin, Phone, DollarSign, RefreshCw} from "lucide-react";
import AccountBalance from "../../../../components/layout/AccountBalance";
import AccountNavigation from "../../../../components/layout/AccountNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useSnackbar } from "notistack";
import axiosServices from "../../../utils/axiosServices";
import {cn} from "../../../utils/utils";

interface WithdrawForm {
    phone: string;
    amount: string;
    method: string;
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
    }>;
}

export default function WithdrawPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const [error, setError] = useState(false);

    const [form, setForm] = useState<WithdrawForm>({
        phone: "",
        amount: "",
        method: "",
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

    // ✅ Pays + Méthodes par pays
    const countries: Country[] = [
        // 🇨🇲 CAMEROUN
        {
            code: "CM",
            name: "Cameroun 🇨🇲",
            prefix: "+237",
            methods: [
                { value: "mtn_momo", label: "MTN MoMo", icon: Smartphone, color: "from-purple-500 to-pink-500", min_amount: 1000 },
                { value: "orange_money", label: "Orange Money", icon: Smartphone, color: "from-orange-500 to-red-500", min_amount: 1000 },
                { value: "wave", label: "Wave", icon: Smartphone, color: "from-blue-500 to-cyan-500", min_amount: 500 },
                { value: "bank_transfer", label: "Virement Bancaire", icon: Banknote, color: "from-emerald-500 to-green-500", min_amount: 5000 },
            ]
        },

        // 🇨🇬 CONGO
        {
            code: "CG",
            name: "Congo 🇨🇬",
            prefix: "+242",
            methods: [
                { value: "airtel_money", label: "Airtel Money", icon: Smartphone, color: "from-orange-500 to-red-500", min_amount: 1000 },
                { value: "mtn_momo", label: "MTN MoMo", icon: Smartphone, color: "from-purple-500 to-pink-500", min_amount: 1000 },
                { value: "bank_transfer", label: "Virement", icon: Banknote, color: "from-emerald-500 to-green-500", min_amount: 5000 },
            ]
        },

        // 🇨🇩 RDC
        {
            code: "CD",
            name: "RDC 🇨🇩",
            prefix: "+243",
            methods: [
                { value: "mtn_momo", label: "MTN MoMo", icon: Smartphone, color: "from-purple-500 to-pink-500", min_amount: 1000 },
                { value: "airtel_money", label: "Airtel Money", icon: Smartphone, color: "from-orange-500 to-red-500", min_amount: 1000 },
                { value: "vodacom_m_pesa", label: "M-Pesa", icon: Smartphone, color: "from-green-500 to-emerald-500", min_amount: 1000 },
                { value: "bank_transfer", label: "Virement", icon: Banknote, color: "from-blue-500 to-indigo-500", min_amount: 10000 },
            ]
        },

        // 🇬🇦 GABON
        {
            code: "GA",
            name: "Gabon 🇬🇦",
            prefix: "+241",
            methods: [
                { value: "airtel_money", label: "Airtel Money", icon: Smartphone, color: "from-orange-500 to-red-500", min_amount: 1000 },
                { value: "moov_money", label: "Moov Money", icon: Smartphone, color: "from-teal-500 to-cyan-500", min_amount: 1000 },
                { value: "bank_transfer", label: "Virement", icon: Banknote, color: "from-emerald-500 to-green-500", min_amount: 5000 },
            ]
        },

        // 🇸🇳 SÉNÉGAL
        {
            code: "SN",
            name: "Sénégal 🇸🇳",
            prefix: "+221",
            methods: [
                { value: "orange_money", label: "Orange Money", icon: Smartphone, color: "from-orange-500 to-red-500", min_amount: 1000 },
                { value: "wave", label: "Wave", icon: Smartphone, color: "from-blue-500 to-cyan-500", min_amount: 500 },
                { value: "free_money", label: "Free Money", icon: Smartphone, color: "from-purple-500 to-violet-500", min_amount: 1000 },
            ]
        },

        // 🇨🇮 CÔTE D'IVOIRE
        {
            code: "CI",
            name: "Côte d'Ivoire 🇨🇮",
            prefix: "+225",
            methods: [
                { value: "orange_money", label: "Orange Money", icon: Smartphone, color: "from-orange-500 to-red-500", min_amount: 1000 },
                { value: "mtn_momo", label: "MTN MoMo", icon: Smartphone, color: "from-purple-500 to-pink-500", min_amount: 1000 },
                { value: "wave", label: "Wave", icon: Smartphone, color: "from-blue-500 to-cyan-500", min_amount: 500 },
                { value: "bank_transfer", label: "Virement", icon: Banknote, color: "from-emerald-500 to-green-500", min_amount: 5000 },
            ]
        },
    ];

    // ✅ Update methods when country changes
    useEffect(() => {
        const country = countries.find(c => c.code === form.country);
        setCurrentCountry(country || null);

        // Reset method to first available
        if (country && country.methods.length > 0) {
            setForm(prev => ({ ...prev, method: country.methods[0].value }));
        }
    }, [form.country]);

    const handleInputChange = (field: keyof WithdrawForm, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        const amountNum = parseFloat(form.amount);
        const currentMethod = currentCountry?.methods.find(m => m.value === form.method);

        if (!form.phone.trim()) {
            enqueueSnackbar("📱 Numéro requis", { variant: "warning" });
            return false;
        }

        if (!form.amount || amountNum <= 0) {
            enqueueSnackbar("💰 Montant invalide", { variant: "warning" });
            return false;
        }

        if (amountNum > balance) {
            enqueueSnackbar(`💸 Solde insuffisant: ${balance.toLocaleString()} XAF`, { variant: "error" });
            return false;
        }

        if (currentMethod && amountNum < currentMethod.min_amount) {
            enqueueSnackbar(`⚠️ Minimum ${currentMethod.min_amount.toLocaleString()} XAF pour ${currentMethod.label}`, { variant: "warning" });
            return false;
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
                amount: parseFloat(form.amount).toString(),
                phone_formatted: formatPhone(),
                country_name: currentCountry?.name,
                method_label: currentCountry?.methods.find(m => m.value === form.method)?.label
            };

            const response = await axiosServices.post("/api/pay/withdraw", payload);

            if (response.data.success) {
                enqueueSnackbar(`✅ Retrait ${response.data.reference} confirmé!`, {
                    variant: "success",
                    persist: true
                });
                setBalance(response.data.new_balance);
                router.push("/account");
            }
        } catch (err: any) {
            const message = err.response?.data?.message || "❌ Erreur retrait";
            enqueueSnackbar(message, { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading") {
        return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-8">Chargement...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20 py-12 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* SIDEBAR */}
                <div className="lg:col-span-1 space-y-8 sticky top-8 self-start">
                    <AccountBalance />
                    <AccountNavigation />
                </div>

                {/* MAIN */}
                <div className="lg:col-span-3">

                    {/* HEADER */}
                    <Card className="border-0 shadow-2xl backdrop-blur-xl overflow-hidden mb-8">
                        <CardContent className="p-0">
                            <div className="bg-gradient-to-r from-blue-600 via-emerald-600 to-green-600 p-8 lg:p-12 text-white">
                                <div className="max-w-4xl mx-auto">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => router.back()}
                                        className="mb-3 text-white hover:bg-white/20"
                                    >
                                        <ArrowLeft className="w-5 h-5 mr-2" />
                                        Retour
                                    </Button>

                                    <h1 className="text-xl lg:text-1xl font-black mb-2 drop-shadow-lg">
                                        Retrait Instantané
                                    </h1>
                                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between text-xl opacity-95">
                                        <p>Solde disponible: <strong className="text-2xl block sm:inline">{balance.toLocaleString()} XAF</strong></p>
                                        {currentCountry && (
                                            <div className="flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-2xl text-sm font-bold">
                                                <MapPin className="w-5 h-5" />
                                                {currentCountry.name}
                                            </div>
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
                                        Sélectionnez votre pays
                                    </Label>
                                    <Select
                                        value={form.country ?? ""}
                                        onValueChange={(value:any) => handleInputChange("country", value)}>
                                        <SelectTrigger className="h-20 text-2xl border-2 border-slate-200/50 hover:border-blue-300 focus:border-blue-400 shadow-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="p-4 max-h-[400px]">
                                            {countries.map(country => (
                                                <SelectItem
                                                    key={country.code}
                                                    value={country.code}
                                                    className="text-xl py-6 hover:bg-gradient-to-r hover:from-blue-50/50 to-emerald-50/50 rounded-2xl shadow-sm"
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
                                        Montant (XAF)
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            placeholder="Minimum 1 000 XAF"
                                            value={form.amount}
                                            onChange={(e) => handleInputChange("amount", e.target.value)}
                                            className="h-20 text-3xl pl-16 border-2 border-slate-200/50 hover:border-emerald-300 focus:border-emerald-400 shadow-xl pr-20"
                                            min={currentCountry?.methods[0]?.min_amount || 1000}
                                            max={balance}
                                        />
                                        <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 text-slate-400" />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm text-slate-500 font-bold bg-slate-100/70 px-4 py-2 rounded-xl">
                                            <span>Max:</span>
                                            <span className="font-black text-slate-900">{balance.toLocaleString()}</span>
                                        </div>
                                    </div>
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
                                        <p className="text-sm text-slate-500 mt-1">
                                            {currentCountry?.methods.find(m => m.value === form.method)?.label || ''}
                                        </p>
                                    </div>
                                </div>

                                {/* MÉTHODES PAR PAYS */}
                                {currentCountry && (
                                    <div>
                                        <Label className="text-xl font-bold text-slate-900 mb-6 block">
                                            Choisissez votre opérateur
                                        </Label>
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                            {currentCountry.methods.map(({ value, label, icon: Icon, color, min_amount }) => {
                                                const isActive = form.method === value;
                                                const amountNum = parseFloat(form.amount);

                                                return (
                                                    <Button
                                                        key={value}
                                                        variant={isActive ? "default" : "outline"}
                                                        className={cn(
                                                            "h-28 flex flex-col gap-3 p-6 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden",
                                                            isActive ? `bg-gradient-to-br ${color} text-white shadow-2xl` : "hover:shadow-xl border-2 hover:border-transparent"
                                                        )}
                                                        onClick={() => handleInputChange("method", value)}
                                                        disabled={amountNum > 0 && amountNum < min_amount}
                                                    >
                                                        {/* Icon */}
                                                        <div className={cn(
                                                            "w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg p-4 mx-auto transition-all",
                                                            isActive ? "bg-white/20 backdrop-blur-sm scale-110 shadow-white/20" : "bg-white/60 hover:scale-105"
                                                        )}>
                                                            <Icon className="w-8 h-8" />
                                                        </div>

                                                        {/* Label */}
                                                        <span className="font-bold text-lg leading-tight">{label}</span>

                                                        {/* Min Amount */}
                                                        <div className="text-xs opacity-90 uppercase tracking-wider font-bold">
                                                            Min: {min_amount.toLocaleString()} XAF
                                                        </div>

                                                        {/* Active Badge */}
                                                        {isActive && (
                                                            <div className="absolute -top-3 -right-3 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
                                                                <span className="text-white font-bold text-sm">✓</span>
                                                            </div>
                                                        )}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* ERROR */}
                                {error && (
                                    <Card className="border-0 bg-red-50/80 backdrop-blur-sm shadow-lg">
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-3 text-red-800">
                                                <DollarSign className="w-6 h-6" />
                                                <p className="font-bold text-lg">{error}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* SUBMIT */}
                                <Button
                                    type="submit"
                                    onClick={handleSubmit}
                                    disabled={loading || !form.method || !form.phone || parseFloat(form.amount) > balance || !currentCountry}
                                    size="lg"
                                    className="w-full h-20 text-2xl font-black shadow-2xl hover:shadow-3xl bg-gradient-to-r from-blue-600 via-emerald-600 to-green-600 hover:from-blue-700 hover:via-emerald-700 hover:to-green-700 text-white disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed disabled:shadow-none"
                                >
                                    {loading ? (
                                        <>
                                            <RefreshCw className="w-8 h-8 mr-4 animate-spin" />
                                            Confirmation...
                                        </>
                                    ) : (
                                        <>
                                            💸 Retirer {parseFloat(form.amount || "0").toLocaleString()} XAF
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