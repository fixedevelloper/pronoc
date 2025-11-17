"use client";

import { usePathname } from "next/navigation";
import HeaderNav from "./HeaderNav";
import BottomNav from "./BottomNav";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Pages où header + bottomnav doivent être masqués
    const hideLayout = pathname.startsWith("/auth/");

    return (
        <>
            {!hideLayout && <HeaderNav />}

            <main
                className={
                    hideLayout
                        ? "min-h-screen flex items-center justify-center"
                        : "pt-25 pb-20 min-h-screen container mx-auto px-4"
                }
            >
                {children}
            </main>

            {!hideLayout && <BottomNav />}
        </>
    );
}
