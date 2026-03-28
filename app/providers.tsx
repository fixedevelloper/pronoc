'use client';
import { SessionProvider } from 'next-auth/react';
import { SnackbarProvider } from 'notistack';
import React from "react";
import AxiosInterceptorSetup from "./utils/AxiosInterceptorSetup";
import ThemeProvider from "./components/layout/ThemeContext"; // UN SEUL !

interface Props {
    children: React.ReactNode;
    session: any; // Type from next-auth
}

export function Providers({ children, session }: Props) {
    return (
        <SessionProvider session={session} refetchInterval={5 * 60} refetchOnWindowFocus={false}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <SnackbarProvider
                    maxSnack={3}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    autoHideDuration={4000}
                    classes={{ variantSuccess: 'bg-green-500', variantError: 'bg-red-500' }}
                >
                    <AxiosInterceptorSetup />
                    {children}
                </SnackbarProvider>
            </ThemeProvider>
        </SessionProvider>
    );
}