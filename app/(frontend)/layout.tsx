import React from "react";
import HeaderNav from "../../components/layout/HeaderNav";
import BottomNav from "../../components/layout/BottomNav";

interface FrontendLayoutProps {
    children: React.ReactNode;
}

export default function FrontendLayout({ children }: FrontendLayoutProps) {
    return (
        <>
            {/* Header fixe */}
            <HeaderNav />

            {/* Contenu avec padding header */}
            <main className="**pt-20 lg:pt-24 pb-20 md:pb-0** min-h-screen bg-theme text-theme container mx-auto px-4 lg:px-8">
                {children}
            </main>

            {/* BottomNav mobile */}
            <BottomNav />
        </>
    );
}