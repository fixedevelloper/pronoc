'use client';
import { SessionProvider } from "next-auth/react";
import { SnackbarProvider } from "notistack";
import AxiosInterceptorSetup from "../utils/AxiosInterceptorSetup";
import {useState} from "react";
import ThemeProvider from "./layout/ThemeContext";

export default function AppProvidersWrapper({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    return (
        <ThemeProvider>
        <SessionProvider>
            <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: "top", horizontal: "right" }} autoHideDuration={4000}>
                {children}
                <AxiosInterceptorSetup />
            </SnackbarProvider>
        </SessionProvider>
        </ThemeProvider>
    );
}
