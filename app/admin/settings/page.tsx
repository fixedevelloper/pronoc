'use client'

import React, { useState, useEffect } from 'react'
import {
    Save,
    RefreshCw,
    CreditCard,
    Shield,
    Users,
    Calendar,
    AlertTriangle,
    Mail,
    Smartphone,
    Database
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Settings {
    siteName: string
    siteUrl: string
    momoApiKey: string
    momoShortcode: string
    predictionsPrice: number
    vipPrice: number
    maintenanceMode: boolean
    emailNotifications: boolean
    smsNotifications: boolean
    maxPredictionsPerDay: number
    allowRegistration: boolean
    currency: 'XAF' | 'EUR'
}

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<Settings>({
        siteName: 'Prédictions FC',
        siteUrl: 'https://predictionsfc.cm',
        momoApiKey: 'XXXXXXX',
        momoShortcode: '00123',
        predictionsPrice: 5000,
        vipPrice: 25000,
        maintenanceMode: false,
        emailNotifications: true,
        smsNotifications: true,
        maxPredictionsPerDay: 10,
        allowRegistration: true,
        currency: 'XAF'
    })
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('general')

    const handleInputChange = (key: keyof Settings, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    const saveSettings = async () => {
        setLoading(true)
        // TODO: API save settings
        console.log('Sauvegarder:', settings)
        setTimeout(() => {
            setLoading(false)
            alert('✅ Paramètres sauvegardés!')
        }, 1000)
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR').format(amount) + ` XAF`
    }

    return (
        <div className="p-6 lg:p-12 space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <Card className="border-0 shadow-2xl">
                <CardHeader className="p-8 lg:p-12 bg-gradient-to-r from-slate-50 to-emerald-50">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl">
                            <Database className="w-12 h-12 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-4xl lg:text-5xl font-black text-slate-900 mb-2">
                                Paramètres
                            </CardTitle>
                            <p className="text-xl text-muted-foreground">
                                Configuration complète de la plateforme
                            </p>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sidebar Actions */}
                <Card className="lg:col-span-1 border-0 shadow-xl">
                    <CardContent className="p-8">
                        <div className="space-y-6">
                            <Button
                                size="lg"
                                className="w-full h-16 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-2xl font-black text-xl border-2 border-emerald-400 flex items-center gap-3"
                                onClick={saveSettings}
                                disabled={loading}
                            >
                                {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                                Sauvegarder
                            </Button>

                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full h-16 border-2 border-slate-300 font-semibold text-lg px-6"
                                onClick={() => window.location.reload()}
                            >
                                <RefreshCw className="w-5 h-5 mr-2" />
                                Réinitialiser
                            </Button>

                            <div className="p-6 bg-emerald-50/60 rounded-2xl border border-emerald-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <Shield className="w-8 h-8 text-emerald-600" />
                                    <h4 className="font-bold text-xl text-emerald-800">Statut Serveur</h4>
                                </div>
                                <Badge className="text-lg px-6 py-3 bg-emerald-100 text-emerald-800 border-2 border-emerald-300">
                                    ✅ En ligne
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Settings */}
                <div className="lg:col-span-2 space-y-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-gradient-to-r from-slate-100 to-emerald-100 p-1 rounded-3xl shadow-xl">
                            <TabsTrigger value="general" className="h-14 text-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-2xl data-[state=active]:border-emerald-300 rounded-2xl">
                                <Calendar className="w-5 h-5 mr-2" />
                                Général
                            </TabsTrigger>
                            <TabsTrigger value="payments" className="h-14 text-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-2xl data-[state=active]:border-emerald-300 rounded-2xl">
                                <CreditCard className="w-5 h-5 mr-2" />
                                Paiements
                            </TabsTrigger>
                            <TabsTrigger value="notifications" className="h-14 text-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-2xl data-[state=active]:border-emerald-300 rounded-2xl">
                                <Mail className="w-5 h-5 mr-2" />
                                Notifications
                            </TabsTrigger>
                            <TabsTrigger value="limits" className="h-14 text-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-2xl data-[state=active]:border-emerald-300 rounded-2xl">
                                <Users className="w-5 h-5 mr-2" />
                                Limites
                            </TabsTrigger>
                            <TabsTrigger value="security" className="h-14 text-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-2xl data-[state=active]:border-emerald-300 rounded-2xl">
                                <Shield className="w-5 h-5 mr-2" />
                                Sécurité
                            </TabsTrigger>
                        </TabsList>

                        {/* Général */}
                        <TabsContent value="general" className="pt-8">
                            <Card className="border-0 shadow-2xl">
                                <CardContent className="p-8 lg:p-12 space-y-8">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div>
                                                <Label className="text-xl font-bold text-slate-800 mb-3 block">Nom du site</Label>
                                                <Input
                                                    value={settings.siteName}
                                                    onChange={(e) => handleInputChange('siteName', e.target.value)}
                                                    className="h-16 text-2xl font-bold border-2 border-slate-200 rounded-2xl shadow-sm focus:border-emerald-400"
                                                    placeholder="Prédictions FC"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xl font-bold text-slate-800 mb-3 block">URL du site</Label>
                                                <Input
                                                    value={settings.siteUrl}
                                                    onChange={(e) => handleInputChange('siteUrl', e.target.value)}
                                                    className="h-16 text-xl border-2 border-slate-200 rounded-2xl shadow-sm focus:border-emerald-400"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-2xl border-2 border-slate-200">
                                                <div>
                                                    <Label className="text-xl font-bold text-slate-800 block mb-1">Maintenance</Label>
                                                    <p className="text-lg text-muted-foreground">Désactive l'accès public</p>
                                                </div>
                                                <Switch
                                                    checked={settings.maintenanceMode}
                                                    onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
                                                    className="data-[state=checked]:bg-emerald-500 h-8 w-14"
                                                />
                                            </div>
                                            <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-2xl border-2 border-slate-200">
                                                <div>
                                                    <Label className="text-xl font-bold text-slate-800 block mb-1">Inscriptions</Label>
                                                    <p className="text-lg text-muted-foreground">Autoriser nouvelles inscriptions</p>
                                                </div>
                                                <Switch
                                                    checked={settings.allowRegistration}
                                                    onCheckedChange={(checked) => handleInputChange('allowRegistration', checked)}
                                                    className="data-[state=checked]:bg-emerald-500 h-8 w-14"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Paiements */}
                        <TabsContent value="payments" className="pt-8">
                            <Card className="border-0 shadow-2xl">
                                <CardContent className="p-8 lg:p-12 space-y-8">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div>
                                                <Label className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                                                    <CreditCard className="w-6 h-6" />
                                                    Prix prédiction simple
                                                </Label>
                                                <Input
                                                    type="number"
                                                    value={settings.predictionsPrice}
                                                    onChange={(e) => handleInputChange('predictionsPrice', parseInt(e.target.value))}
                                                    className="h-16 text-2xl font-bold border-2 border-slate-200 rounded-2xl shadow-sm focus:border-emerald-400 text-right pr-12"
                                                />
                                                <p className="text-lg text-emerald-600 font-bold mt-2">
                                                    {formatCurrency(settings.predictionsPrice)}
                                                </p>
                                            </div>
                                            <div>
                                                <Label className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                                                    Prix VIP Mensuel
                                                </Label>
                                                <Input
                                                    type="number"
                                                    value={settings.vipPrice}
                                                    onChange={(e) => handleInputChange('vipPrice', parseInt(e.target.value))}
                                                    className="h-16 text-2xl font-bold border-2 border-slate-200 rounded-2xl shadow-sm focus:border-emerald-400 text-right pr-12"
                                                />
                                                <p className="text-lg text-emerald-600 font-bold mt-2">
                                                    {formatCurrency(settings.vipPrice)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div>
                                                <Label className="text-xl font-bold text-slate-800 mb-3 block">Clé API MTN MoMo</Label>
                                                <Input
                                                    value={settings.momoApiKey}
                                                    onChange={(e) => handleInputChange('momoApiKey', e.target.value)}
                                                    className="h-16 text-xl border-2 border-slate-200 rounded-2xl shadow-sm focus:border-emerald-400"
                                                    placeholder="Votre clé API MTN MoMo"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xl font-bold text-slate-800 mb-3 block">Shortcode MTN MoMo</Label>
                                                <Input
                                                    value={settings.momoShortcode}
                                                    onChange={(e) => handleInputChange('momoShortcode', e.target.value)}
                                                    className="h-16 text-xl border-2 border-slate-200 rounded-2xl shadow-sm focus:border-emerald-400"
                                                    placeholder="00123"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl border-2 border-emerald-200">
                                        <div className="flex items-center gap-4 mb-4">
                                            <Smartphone className="w-10 h-10 text-emerald-600" />
                                            <h4 className="text-2xl font-black text-emerald-800">MTN MoMo ✅ Actif</h4>
                                        </div>
                                        <Badge className="text-xl px-8 py-4 bg-emerald-100 text-emerald-800 border-2 border-emerald-300 shadow-lg">
                                            Prêt pour paiements Cameroon
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Notifications */}
                        <TabsContent value="notifications" className="pt-8">
                            <Card className="border-0 shadow-2xl">
                                <CardContent className="p-8 lg:p-12 space-y-8">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
                                                <div>
                                                    <Label className="text-xl font-bold text-slate-800 block mb-1">Emails</Label>
                                                    <p className="text-lg text-slate-700">Notifications par email</p>
                                                </div>
                                                <Switch
                                                    checked={settings.emailNotifications}
                                                    onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                                                    className="data-[state=checked]:bg-blue-500 h-8 w-14"
                                                />
                                            </div>
                                            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200">
                                                <div>
                                                    <Label className="text-xl font-bold text-slate-800 block mb-1">SMS</Label>
                                                    <p className="text-lg text-slate-700">Notifications SMS MTN</p>
                                                </div>
                                                <Switch
                                                    checked={settings.smsNotifications}
                                                    onCheckedChange={(checked) => handleInputChange('smsNotifications', checked)}
                                                    className="data-[state=checked]:bg-emerald-500 h-8 w-14"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Limites & Sécurité - placeholders pour démo */}
                        <TabsContent value="limits" className="pt-8">
                            <Card className="border-0 shadow-2xl">
                                <CardContent className="p-8 lg:p-12 space-y-6">
                                    <div>
                                        <Label className="text-xl font-bold text-slate-800 mb-3 block">Max prédictions/jour</Label>
                                        <Input
                                            type="number"
                                            value={settings.maxPredictionsPerDay}
                                            onChange={(e) => handleInputChange('maxPredictionsPerDay', parseInt(e.target.value))}
                                            className="h-16 w-32 text-2xl font-bold border-2 border-slate-200 rounded-2xl shadow-sm focus:border-emerald-400"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="security" className="pt-8">
                            <Card className="border-0 shadow-2xl">
                                <CardContent className="p-8 lg:p-12">
                                    <div className="space-y-6">
                                        <div className="flex items-center p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border-2 border-red-200">
                                            <AlertTriangle className="w-12 h-12 text-red-500 mr-4 flex-shrink-0" />
                                            <div>
                                                <h4 className="text-2xl font-black text-red-800 mb-2">Sécurité renforcée</h4>
                                                <p className="text-lg text-red-700">Activez 2FA pour tous les admins</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}