import './globals.css';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { Providers } from './providers';
import {authOptions} from "./api/auth/[...nextauth]/options";
import React from "react";
import LayoutWrapper from "../components/layout/LayoutWrapper";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata = {
    title: { template: '%s | Prono Crew', default: 'Prono Crew' },
    description: 'Pronostics foot IA + paris mutuels',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    return (
        <html lang="fr" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
        <body className="transition-colors duration-300 bg-theme text-gray-900 antialiased">
        <Providers session={session}>
            <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
        </body>
        </html>
    );
}

