'use client';
import { usePathname } from 'next/navigation';
import HeaderNav from './HeaderNav';      // Frontend nav
import BottomNav from './BottomNav';
import React from "react";
import AdminLayout from "../../admin/layout";     // Frontend mobile

interface Props {
    children: React.ReactNode;
    variant: 'frontend' | 'auth' | 'admin';
}

export default function LayoutWrapper({ children, variant }: Props) {
    const pathname = usePathname();

    // Skip nav sur certaines pages frontend
    const hideFrontendNav = pathname.startsWith('/frontend/special');

    if (variant === 'admin') {
        return <AdminLayout>{children}</AdminLayout>; // Sidebar pro
    }

    return (
        <>
            {variant === 'frontend' && !hideFrontendNav && <HeaderNav />}

            <main className={
                variant === 'auth'
                    ? 'min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-emerald-50 to-blue-50'
                    : 'pt-20 pb-20 min-h-[calc(100vh-80px)] container mx-auto px-4 lg:px-8'
            }>
                {children}
            </main>

            {variant === 'frontend' && !hideFrontendNav && <BottomNav />}
        </>
    );
}