'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import {useTheme} from "./ThemeContext";
import {useSession} from "next-auth/react";
import {LogInIcon, UserIcon} from "lucide-react";

const navItems = [
    { href: "/", label: "Accueil" },
    { href: "/blog", label: "Actualites" },
    { href: "/pots", label: "Jouer" },
    { href: "/faq", label: "Faq" },
];

export default function HeaderNav() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();
    const { data: session } = useSession();
    return (
        <header className="fixed top-0 left-0 right-0 h-24 bg-theme shadow-sm z-50 transition-colors duration-300 p-2">
            <div className="container mx-auto flex justify-between items-center px-6">

                {/* Logo + slogan */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-3">
                    <Link href="/" className="flex items-center gap-2">
                        <img
                            src={theme === "dark" ? "/images/logo-dark.png" : "/images/logo.png"}
                            alt="PronoCrew Logo"
                            className="h-16 w-auto"
                        />
                    </Link>

                </div>

                {/* Navigation */}
                <nav className="hidden md:flex gap-6 text-sm font-medium items-end">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`transition-colors duration-300 ${
                                    isActive ? "text-primary" : "text-theme hover:text-primary"
                                }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User / Theme */}
                <div className="flex items-center gap-4">
                    {session?.user ? (
                        <Link
                            href="/account"
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-theme hover:text-white
             hover:bg-primary transition-all duration-300 group"
                        >
                            <UserIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                            <span className="font-medium">Mon compte</span>
                        </Link>

                    ) : (
                        <Link
                            href="/auth/login"
                            className="flex btn btn-primary items-center gap-2 px-3 py-2 rounded-xl text-theme hover:text-white
             hover:bg-primary transition-all duration-300 group"
                        >
                            <LogInIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                            <span className="font-medium"> Se connecter</span>
                        </Link>
                    )}
                {/*    <button
                        onClick={toggleTheme}
                        className="px-2 py-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    >
                        {theme === "dark" ? "☀️" : "🌙"}
                    </button>*/}
                </div>

            </div>
        </header>

    );
}
