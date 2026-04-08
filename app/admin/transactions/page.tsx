'use client'

import React, { useState, useEffect } from 'react'
import {Search, Filter, Download, CreditCard, TrendingUp, AlertCircle, Eye, User} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'

interface Transaction {
    id: string
    userId: string
    userName: string
    amount: number
    currency: string
    status: 'pending' | 'completed' | 'failed' | 'refunded'
    method: 'momo' | 'card' | 'bank' | 'crypto'
    date: string
    description: string
}

export default function AdminTransactionPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [dateFilter, setDateFilter] = useState('all')
    const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set())

    // Mock data - Cameroon MTN MoMo + transactions
    useEffect(() => {
        const mockTransactions: Transaction[] = [
            {
                id: 'TXN001',
                userId: '1',
                userName: 'Julio Mbah',
                amount: 25000,
                currency: 'XAF',
                status: 'completed',
                method: 'momo',
                date: '2026-03-28 14:30',
                description: 'Recharge prédictions VIP'
            },
            {
                id: 'TXN002',
                userId: '2',
                userName: 'Jean Dupont',
                amount: 5000,
                currency: 'XAF',
                status: 'pending',
                method: 'momo',
                date: '2026-03-28 10:15',
                description: 'Pack 10 prédictions'
            },
            {
                id: 'TXN003',
                userId: '3',
                userName: 'Marie K',
                amount: 150000,
                currency: 'XAF',
                status: 'completed',
                method: 'bank',
                date: '2026-03-27 19:45',
                description: 'Abonnement Premium Annuel'
            },
            {
                id: 'TXN004',
                userId: '4',
                userName: 'Paul N',
                amount: 12000,
                currency: 'XAF',
                status: 'failed',
                method: 'card',
                date: '2026-03-28 09:20',
                description: 'Recharge échouée'
            }
        ]
        setTransactions(mockTransactions)
        setFilteredTransactions(mockTransactions)
    }, [])

    // Filtres
    useEffect(() => {
        let filtered = transactions

        if (searchTerm) {
            filtered = filtered.filter(t =>
                t.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.id.includes(searchTerm) ||
                t.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(t => t.status === statusFilter)
        }

        if (dateFilter !== 'all') {
            const today = new Date().toISOString().split('T')[0]
            filtered = filtered.filter(t => {
                const txDate = t.date.split(' ')[0]
                if (dateFilter === 'today') return txDate === today
                if (dateFilter === 'week') {
                    // Mock week filter
                    return true
                }
                return true
            })
        }

        setFilteredTransactions(filtered)
    }, [searchTerm, statusFilter, dateFilter, transactions])

    const toggleTransaction = (txId: string) => {
        const newSelected = new Set(selectedTransactions)
        if (newSelected.has(txId)) newSelected.delete(txId)
        else newSelected.add(txId)
        setSelectedTransactions(newSelected)
    }

    const bulkAction = (action: 'refund' | 'retry' | 'cancel') => {
        console.log(`Action ${action} sur ${selectedTransactions.size} transactions`)
    }

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('fr-FR').format(amount) + ` ${currency}`
    }

    return (
        <div className="p-6 lg:p-12 space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <Card className="border-0 shadow-2xl">
                <CardHeader className="p-8 lg:p-12 bg-gradient-to-r from-slate-50 via-emerald-50 to-blue-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 via-teal-600 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl">
                                <CreditCard className="w-12 h-12 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-4xl lg:text-5xl font-black text-slate-900 mb-2">
                                    Transactions
                                </CardTitle>
                                <p className="text-xl text-muted-foreground">
                                    {transactions.length} transactions • Total: {formatCurrency(
                                    transactions.reduce((sum, t) => sum + t.amount, 0), 'XAF'
                                )}
                                </p>
                            </div>
                        </div>
                        <Badge className="text-2xl px-8 py-4 bg-emerald-100 text-emerald-800 border-2 border-emerald-300">
                            MTN MoMo ✅
                        </Badge>
                    </div>
                </CardHeader>
            </Card>

            {/* Filtres & Actions */}
            <Card className="border-0 shadow-xl">
                <CardContent className="p-8 lg:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Recherche */}
                        <div className="relative lg:col-span-1">
                            <Search className="w-6 h-6 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
                            <Input
                                placeholder="Rechercher ID, nom, description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 pr-6 h-14 bg-slate-50 border-2 border-slate-200 w-full rounded-2xl shadow-sm"
                            />
                        </div>

                        {/* Filtres */}
                        <div className="flex gap-4 lg:col-span-2">
                            <div className="flex-1">
                                <Select value={statusFilter}  onValueChange={(value) => setStatusFilter(value ?? "")}>
                                    <SelectTrigger className="h-14 rounded-2xl border-2 border-slate-200 bg-slate-50">
                                        <SelectValue placeholder="Tous statuts" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous statuts</SelectItem>
                                        <SelectItem value="pending">En attente</SelectItem>
                                        <SelectItem value="completed">Terminé</SelectItem>
                                        <SelectItem value="failed">Échoué</SelectItem>
                                        <SelectItem value="refunded">Remboursé</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex-1">
                                <Select value={dateFilter}  onValueChange={(value) => setDateFilter(value ?? "")}>
                                    <SelectTrigger className="h-14 rounded-2xl border-2 border-slate-200 bg-slate-50">
                                        <SelectValue placeholder="Toutes dates" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Toutes dates</SelectItem>
                                        <SelectItem value="today">Aujourd'hui</SelectItem>
                                        <SelectItem value="week">Cette semaine</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Actions Bulk */}
                    <div className="flex gap-4 flex-wrap">
                        <Button
                            variant="outline"
                            size="lg"
                            className="h-14 px-8 font-semibold border-2 border-orange-400 text-orange-700 hover:bg-orange-50 gap-2"
                            onClick={() => bulkAction('refund')}
                            disabled={selectedTransactions.size === 0}
                        >
                            Rembourser ({selectedTransactions.size})
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="h-14 px-8 font-semibold border-2 border-emerald-400 text-emerald-700 hover:bg-emerald-50 gap-2"
                            onClick={() => bulkAction('retry')}
                            disabled={selectedTransactions.size === 0}
                        >
                            Relancer ({selectedTransactions.size})
                        </Button>
                        <Button
                            variant="destructive"
                            size="lg"
                            className="h-14 px-8 font-bold shadow-lg gap-2"
                            onClick={() => bulkAction('cancel')}
                            disabled={selectedTransactions.size === 0}
                        >
                            Annuler ({selectedTransactions.size})
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="h-14 px-8 font-semibold border-2 border-blue-400 text-blue-700 hover:bg-blue-50 gap-2"
                        >
                            <Download className="w-5 h-5 mr-2" />
                            Exporter CSV
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Tableau Transactions */}
            <Card className="border-0 shadow-2xl overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-b-4 border-slate-200">
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={selectedTransactions.size === filteredTransactions.length && filteredTransactions.length > 0}
                                        onCheckedChange={() => {
                                            if (selectedTransactions.size === filteredTransactions.length) {
                                                setSelectedTransactions(new Set())
                                            } else {
                                                setSelectedTransactions(new Set(filteredTransactions.map(t => t.id)))
                                            }
                                        }}
                                    />
                                </TableHead>
                                <TableHead className="font-black text-lg text-slate-800 w-48">ID</TableHead>
                                <TableHead className="font-black text-lg text-slate-800">Utilisateur</TableHead>
                                <TableHead className="font-black text-lg text-slate-800">Montant</TableHead>
                                <TableHead className="font-black text-lg text-slate-800">Méthode</TableHead>
                                <TableHead className="font-black text-lg text-slate-800">Statut</TableHead>
                                <TableHead className="font-black text-lg text-slate-800 text-center">Date</TableHead>
                                <TableHead className="font-black text-lg text-slate-800 w-48 text-right">Description</TableHead>
                                <TableHead className="w-24 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTransactions.map((tx) => (
                                <TableRow key={tx.id} className="group hover:bg-emerald-50/30 border-b border-slate-100 transition-all h-20">
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedTransactions.has(tx.id)}
                                            onCheckedChange={() => toggleTransaction(tx.id)}
                                            className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                        />
                                    </TableCell>
                                    <TableCell className="font-bold text-lg text-slate-900">{tx.id}</TableCell>
                                    <TableCell className="font-semibold text-xl text-slate-900">
                                        <div className="flex items-center gap-2">
                                            <User className="w-8 h-8 text-emerald-500 flex-shrink-0" />
                                            {tx.userName}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-black text-2xl text-emerald-600">
                                        {formatCurrency(tx.amount, tx.currency)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={tx.method === 'momo' ? 'default' : 'secondary'}
                                            className={`px-4 py-2 text-lg font-bold text-white ${
                                                tx.method === 'momo'
                                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-400 shadow-lg'
                                                    : 'bg-slate-200 text-slate-800 border-slate-300'
                                            }`}
                                        >
                                            {tx.method.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={tx.status === 'completed' ? 'default' : tx.status === 'pending' ? 'secondary' : 'destructive'}
                                            className={`px-4 py-2 text-lg font-bold shadow-md ${
                                                tx.status === 'completed' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                                                    tx.status === 'pending' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                                                        tx.status === 'failed' ? 'bg-red-100 text-red-800 border-red-300' :
                                                            'bg-slate-100 text-slate-800 border-slate-300'
                                            }`}
                                        >
                                            {tx.status.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center font-semibold text-slate-700 text-lg">
                                        {tx.date}
                                    </TableCell>
                                    <TableCell className="text-right text-lg text-slate-600 max-w-xs truncate" title={tx.description}>
                                        {tx.description}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Dialog>
                                            <DialogTrigger>
                                                <Button size="icon" variant="ghost" className="h-12 w-12 hover:bg-emerald-100 hover:text-emerald-700 rounded-xl shadow-md">
                                                    <Eye className="w-6 h-6" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <div className="space-y-4">
                                                    <h3 className="text-2xl font-black">Transaction {tx.id}</h3>
                                                    <div className="grid grid-cols-2 gap-4 text-lg">
                                                        <div><strong>Utilisateur:</strong> {tx.userName}</div>
                                                        <div><strong>Montant:</strong> {formatCurrency(tx.amount, tx.currency)}</div>
                                                        <div><strong>Méthode:</strong> {tx.method.toUpperCase()}</div>
                                                        <div><strong>Date:</strong> {tx.date}</div>
                                                        <div><strong>Statut:</strong> {tx.status.toUpperCase()}</div>
                                                        <div className="col-span-2"><strong>Description:</strong> {tx.description}</div>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {filteredTransactions.length === 0 && (
                <Card className="border-0 shadow-2xl text-center">
                    <CardContent className="p-20">
                        <CreditCard className="w-24 h-24 text-muted-foreground mx-auto mb-6 opacity-50" />
                        <h3 className="text-3xl font-black text-slate-500 mb-2">Aucune transaction trouvée</h3>
                        <p className="text-xl text-muted-foreground mb-8">Modifiez vos filtres ou recherche</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}