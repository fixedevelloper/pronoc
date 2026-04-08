import type { Metadata } from 'next';
import { SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { cn } from '@/lib/utils';
import React from "react";

export const metadata: Metadata = {
    title: 'Admin | PronoCrew',
    description: 'Tableau de bord administrateur PronoCrew'
};


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 h-screen w-screen flex bg-gradient-to-br from-slate-50/50 via-white/80 to-emerald-50/50 dark:from-gray-900/80 dark:via-slate-900/80 dark:to-emerald-900/20 backdrop-blur-xl overflow-hidden">

            <SidebarProvider className="h-full w-full flex">
                {/* Sidebar */}
                <AdminSidebar />

                {/* Main Content */}
                <div className="flex h-full flex-1 flex-col lg:ml-[--sidebar-width] overflow-hidden">

                    {/* Header */}
                    <AdminHeader />

                    {/* Contenu */}
                    <main className={cn(
                        "h-0 flex-1 overflow-auto p-4 sm:p-6 lg:p-8 xl:p-12 transition-all duration-300 scrollbar-thin scrollbar-thumb-emerald-500/50 scrollbar-track-transparent",
                        "bg-background/95 backdrop-blur-2xl shadow-inner border-t border-border/30"
                    )}>
                        {children}
                    </main>

                </div>
            </SidebarProvider>
        </div>
    );
}