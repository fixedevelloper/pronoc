'use client';

import { useEffect, useState, useMemo } from "react";
import {signOut, useSession} from "next-auth/react";
import axiosServices from "../../../utils/axiosServices";
import Link from "next/link";
import AccountNavigation from "../../../components/layout/AccountNavigation";
import AccountBalance from "../../../components/layout/AccountBalance";
import {useRouter} from "next/navigation";

type TxType = "deposit" | "commission" | "win" | "withdrawal" | string;

type Transaction = {
    id: number;
    user_id?: number;
    pot_id?: number | null;
    type: TxType;
    amount: number;
    status: "pending" | "success" | "failed" | string;
    reference: string;
    created_at: string;
};


export default function AccountTransactionsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(10);
    const [lastPage, setLastPage] = useState<number>(1);

    // filters
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [query, setQuery] = useState<string>("");
    const [dateFrom, setDateFrom] = useState<string>("");
    const [dateTo, setDateTo] = useState<string>("");

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



    // fetch data
    const fetchTransactions = async (pageNumber = 1) => {
        setLoading(true);
        try {
            const params: any = {
                page: pageNumber,
                per_page: perPage,
            };
            if (typeFilter !== "all") params.type = typeFilter;
            if (statusFilter !== "all") params.status = statusFilter;
            if (query) params.q = query;
            if (dateFrom) params.from = dateFrom;
            if (dateTo) params.to = dateTo;

            const res = await axiosServices.get("/api/account/transactions", { params });
            // Laravel paginate -> res.data.data (items), meta properties
            const data = res.data.data ?? res.data; // fallback
            setTransactions(data || []);
            setPage(res.data.current_page || pageNumber);
            setLastPage(res.data.last_page || 1);
        } catch (err) {
            console.error("Erreur fetch transactions", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!session) return;
        fetchTransactions(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session, perPage]);

    // apply filters -> refetch on change
    useEffect(() => {
        if (!session) return;
        const timer = setTimeout(() => fetchTransactions(1), 300); // debounce
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [typeFilter, statusFilter, query, dateFrom, dateTo]);

    const onChangePage = (newPage: number) => {
        if (newPage < 1 || newPage > lastPage) return;
        fetchTransactions(newPage);
    };

    const typeBadge = (t: TxType) => {
        switch (t) {
            case "deposit": return "bg-green-100 text-green-800";
            case "win": return "bg-indigo-100 text-indigo-800";
            case "withdrawal": return "bg-yellow-100 text-yellow-800";
            case "commission": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const statusBadge = (s: string) => {
        if (s === "success") return "bg-green-50 text-green-700";
        if (s === "pending") return "bg-yellow-50 text-yellow-700";
        if (s === "failed") return "bg-red-50 text-red-700";
        return "bg-gray-50 text-gray-700";
    };

    //const formattedDate = (d: string) => dayjs(d).format("DD/MM/YYYY HH:mm");

    return (
        <div className="max-w-8xl mx-auto mt-8 px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* ---------------- SIDEBAR ---------------- */}
            <div className="md:col-span-1 space-y-6">
                <AccountBalance />

                {/* Navigation */}
                <AccountNavigation />
            </div>
            <div className="md:col-span-2">
            <h1 className="text-2xl font-bold text-blue-600 mb-4">Mes transactions</h1>

            {/* Filters */}
            <div className="bg-theme p-4 rounded-lg shadow mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="p-2 rounded border">
                        <option value="all">Tous types</option>
                        <option value="deposit">Dépôt</option>
                        <option value="withdrawal">Retrait</option>
                        <option value="win">Gain</option>
                        <option value="commission">Commission</option>
                    </select>

                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="p-2 rounded border">
                        <option value="all">Tous statuts</option>
                        <option value="success">Success</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                    </select>

                    <input
                        type="date"
                        value={dateFrom}
                        onChange={e => setDateFrom(e.target.value)}
                        className="p-2 rounded border"
                        placeholder="From"
                    />

                    <input
                        type="date"
                        value={dateTo}
                        onChange={e => setDateTo(e.target.value)}
                        className="p-2 rounded border"
                        placeholder="To"
                    />
                </div>

                <div className="mt-3 flex gap-2">
                    <input
                        type="search"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className="flex-1 p-2 rounded border"
                        placeholder="Rechercher référence / pot id / montant..."
                    />
                    <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))} className="p-2 rounded border">
                        <option value={10}>10 / page</option>
                        <option value={20}>20 / page</option>
                        <option value={50}>50 / page</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-theme p-4 rounded-lg shadow">
                {loading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="animate-pulse h-12 bg-gray-200 rounded" />
                        ))}
                    </div>
                ) : transactions.length === 0 ? (
                    <p className="text-center text-theme py-8">Aucune transaction trouvée.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                            <tr className="text-sm text-theme">
                                <th className="py-2">Date</th>
                                <th className="py-2">Type</th>
                                <th className="py-2">Référence</th>
                                <th className="py-2">Montant</th>
                                <th className="py-2">Pot</th>
                                <th className="py-2">Statut</th>
                            </tr>
                            </thead>
                            <tbody>
                            {transactions.map(tx => (
                                <tr key={tx.id} className="border-t">
                                    <td className="py-3 text-sm text-theme">{tx.created_at}</td>
                                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${typeBadge(tx.type)}`}>
                        {tx.type}
                      </span>
                                    </td>
                                    <td className="py-3 text-sm">{tx.reference}</td>
                                    <td className={`py-3 text-sm font-semibold ${tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {tx.amount.toFixed(2)}
                                    </td>
                                    <td className="py-3 text-sm">{tx.pot_id ?? "-"}</td>
                                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge(tx.status)}`}>
                        {tx.status}
                      </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-600">
                        Page {page} / {lastPage}
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => onChangePage(page - 1)} disabled={page <= 1} className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50">Précédent</button>
                        <button onClick={() => onChangePage(page + 1)} disabled={page >= lastPage} className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50">Suivant</button>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );

}
