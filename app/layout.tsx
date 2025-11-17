

import "./globals.css";
import AppProvidersWrapper from "./components/AppWrapper";
import ThemeProvider from "./components/layout/ThemeContext";
import LayoutWrapper from "./components/layout/LayoutWrapper";

export const metadata = {
    title: {
        template: "%s | Prono crew",
        default: "Prono crew",
    },
    description: "Application de pronostics football facile",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr">
        <body className="transition-colors duration-300
                 bg-theme text-gray-900
              ">

        <AppProvidersWrapper>
            <ThemeProvider>
                <LayoutWrapper>
                    {children}
                </LayoutWrapper>
            </ThemeProvider>
        </AppProvidersWrapper>
        </body>
        </html>
    );
}


