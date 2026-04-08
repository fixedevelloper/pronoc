'use client'

import React, { useState, useEffect } from 'react'
import { Search, Edit3, Trash2, User, Users, Ban, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'

interface User {
    id: string
    email: string
    name: string
    role: 'user' | 'admin' | 'moderator'
    status: 'active' | 'inactive' | 'banned'
    predictions: number
    lastLogin: string
    createdAt: string
}

export default function AdminUserPage() {
    const [users, setUsers] = useState<User[]>([])
    const [filteredUsers, setFilteredUsers] = useState<User[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())

    // Mock data - remplacez par votre API
    useEffect(() => {
        const mockUsers: User[] = [
            { id: '1', email: 'julio@example.com', name: 'Julio Mbah', role: 'admin', status: 'active', predictions: 45, lastLogin: '2026-03-28', createdAt: '2025-01-15' },
            { id: '2', email: 'user1@cm', name: 'Jean Dupont', role: 'user', status: 'active', predictions: 23, lastLogin: '2026-03-27', createdAt: '2025-02-10' },
            { id: '3', email: 'user2@cm', name: 'Marie K', role: 'moderator', status: 'inactive', predictions: 12, lastLogin: '2026-03-20', createdAt: '2025-03-05' },
        ]
        setUsers(mockUsers)
        setFilteredUsers(mockUsers)
    }, [])

    // Filtre recherche
    useEffect(() => {
        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredUsers(filtered)
    }, [searchTerm, users])

    const toggleUser = (userId: string) => {
        const newSelected = new Set(selectedUsers)
        if (newSelected.has(userId)) newSelected.delete(userId)
        else newSelected.add(userId)
        setSelectedUsers(newSelected)
    }

    const bulkAction = (action: 'ban' | 'delete' | 'activate') => {
        console.log(`Action ${action} sur ${selectedUsers.size} utilisateurs`)
        // TODO: API calls
    }

    return (
        <div className="p-6 lg:p-12 space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <Card className="border-0 shadow-2xl">
                <CardHeader className="p-8 lg:p-12 bg-gradient-to-r from-slate-50 to-emerald-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl">
                                <Users className="w-12 h-12 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-4xl lg:text-5xl font-black text-slate-900 mb-2">
                                    Gestion Utilisateurs
                                </CardTitle>
                                <p className="text-xl text-muted-foreground">
                                    {users.length} utilisateurs total • {selectedUsers.size} sélectionné(s)
                                </p>
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Actions & Recherche */}
            <Card className="border-0 shadow-xl">
                <CardContent className="p-8 lg:p-12">
                    <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between mb-8">
                        {/* Recherche */}
                        <div className="relative w-full lg:w-96">
                            <Search className="w-6 h-6 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
                            <Input
                                placeholder="Rechercher par nom ou email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 pr-6 h-14 bg-slate-50 border-2 border-slate-200 w-full rounded-2xl shadow-sm"
                            />
                        </div>

                        {/* Actions Bulk */}
                        <div className="flex gap-4 flex-wrap">
                            <Button
                                variant="outline"
                                size="lg"
                                className="h-14 px-8 font-semibold border-2 border-slate-300 gap-2"
                                onClick={() => bulkAction('activate')}
                                disabled={selectedUsers.size === 0}
                            >
                                Activer ({selectedUsers.size})
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="h-14 px-8 font-semibold border-2 border-orange-400 text-orange-700 hover:bg-orange-50 gap-2"
                                onClick={() => bulkAction('ban')}
                                disabled={selectedUsers.size === 0}
                            >
                                <Ban className="w-5 h-5" />
                                Bannir ({selectedUsers.size})
                            </Button>
                            <Button
                                variant="destructive"
                                size="lg"
                                className="h-14 px-8 font-bold shadow-lg gap-2"
                                onClick={() => bulkAction('delete')}
                                disabled={selectedUsers.size === 0}
                            >
                                <Trash2 className="w-5 h-5" />
                                Supprimer ({selectedUsers.size})
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tableau Utilisateurs */}
            <Card className="border-0 shadow-2xl overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-b-2 border-slate-200">
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                                        onCheckedChange={() => {
                                            if (selectedUsers.size === filteredUsers.length) {
                                                setSelectedUsers(new Set())
                                            } else {
                                                setSelectedUsers(new Set(filteredUsers.map(u => u.id)))
                                            }
                                        }}
                                    />
                                </TableHead>
                                <TableHead className="font-black text-lg text-slate-800 w-12">Nom</TableHead>
                                <TableHead className="font-black text-lg text-slate-800">Email</TableHead>
                                <TableHead className="font-black text-lg text-slate-800">Rôle</TableHead>
                                <TableHead className="font-black text-lg text-slate-800">Statut</TableHead>
                                <TableHead className="font-black text-lg text-slate-800 text-center">Prédictions</TableHead>
                                <TableHead className="font-black text-lg text-slate-800 text-center">Dernière Connexion</TableHead>
                                <TableHead className="w-24 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id} className="group hover:bg-emerald-50/50 border-b border-slate-100 transition-all h-20">
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedUsers.has(user.id)}
                                            onCheckedChange={() => toggleUser(user.id)}
                                            className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                        />
                                    </TableCell>
                                    <TableCell className="font-semibold text-xl text-slate-900 group-hover:text-emerald-800">
                                        <div className="flex items-center gap-3">
                                            <User className="w-10 h-10 text-emerald-500 flex-shrink-0" />
                                            {user.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-lg">{user.email}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={user.role === 'admin' ? 'default' : user.role === 'moderator' ? 'secondary' : 'outline'}
                                            className="px-4 py-2 text-lg font-bold"
                                        >
                                            {user.role.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={user.status === 'active' ? 'default' : 'destructive'}
                                            className={`px-4 py-2 text-lg font-bold ${user.status === 'active' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-red-100 text-red-800 border-red-300'}`}
                                        >
                                            {user.status === 'active' ? 'ACTIF' : user.status.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center font-bold text-xl text-emerald-600">
                                        {user.predictions}
                                    </TableCell>
                                    <TableCell className="text-center font-semibold text-slate-700">
                                        {user.lastLogin}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-2 justify-end">
                                            <Dialog>
                                                <DialogTrigger>
                                                    <Button size="icon" variant="ghost" className="h-12 w-12 hover:bg-emerald-100 hover:text-emerald-700 rounded-xl">
                                                        <Edit3 className="w-6 h-6" />
                                                    </Button>
                                                </DialogTrigger>
                                            </Dialog>
                                            <Button size="icon" variant="ghost" className="h-12 w-12 hover:bg-red-100 hover:text-red-700 rounded-xl">
                                                <Trash2 className="w-6 h-6" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {filteredUsers.length === 0 && (
                <Card className="border-0 shadow-2xl text-center">
                    <CardContent className="p-20">
                        <Users className="w-24 h-24 text-muted-foreground mx-auto mb-6 opacity-50" />
                        <h3 className="text-3xl font-black text-slate-500 mb-2">Aucun utilisateur trouvé</h3>
                        <p className="text-xl text-muted-foreground mb-8">Essayez de modifier votre recherche</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}