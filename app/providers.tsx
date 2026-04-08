'use client';
import { SessionProvider } from 'next-auth/react';
import { SnackbarProvider } from 'notistack';
import React from "react";
import AxiosInterceptorSetup from "./utils/AxiosInterceptorSetup";
import ThemeProvider from "../components/layout/ThemeContext"; // UN SEUL !

interface Props {
    children: React.ReactNode;
    session: any; // Type from next-auth
}

export function Providers({ children, session }: Props) {
    return (
        <SessionProvider session={session} refetchInterval={5 * 60} refetchOnWindowFocus={false}>
            <ThemeProvider>
                <SnackbarProvider
                    maxSnack={3}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    autoHideDuration={4000}
                >
                    <AxiosInterceptorSetup />
                    {children}
                </SnackbarProvider>
            </ThemeProvider>
        </SessionProvider>
    );
}