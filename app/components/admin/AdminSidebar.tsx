'use client';
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Trophy, Users, BarChart3, Zap, FileText, DollarSign, Settings, Football } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
    { icon: Football, label: 'Fixtures', href: '/admin/fixtures' },
    { icon: Trophy, label: 'Pots', href: '/admin/pots' },
    { icon: Zap, label: 'IA Prédictions', href: '/admin/ai' },
    { icon: Users, label: 'Utilisateurs', href: '/admin/users' },
    { icon: DollarSign, label: 'Transactions', href: '/admin/transactions' },
    { icon: BarChart3, label: 'Stats', href: '/admin/stats' },
    { icon: Settings, label: 'Paramètres', href: '/admin/settings' },
];

export function AdminSidebar() {
    const pathname = usePathname();
    return (
        <Sidebar>
            <SidebarHeader className="p-4 border-b">
                <div className="flex items-center gap-3">
                    <Football className="h-8 w-8 text-emerald-500" />
                    <h2 className="font-bold text-xl bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                        Prono Crew Admin
                    </h2>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {menuItems.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton asChild>
                                    <Link href={item.href} className={pathname === item.href ? 'bg-emerald-500/20' : ''}>
                                        <item.icon className="mr-2 h-4 w-4" />
                                        {item.label}
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}