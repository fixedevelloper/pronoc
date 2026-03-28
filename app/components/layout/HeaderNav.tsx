'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeContext";
import { useSession } from "next-auth/react";
import { LogInIcon, UserIcon, Menu, Sun, Moon, ChevronDown } from "lucide-react";

const navItems = [
    { href: "/", label: "Accueil" },
    { href: "/pronostics", label: "Pronostics" },
    { href: "/blog", label: "Actualités" },
    { href: "/pots", label: "Jouer" },
    { href: "/faq", label: "FAQ" },
];

export default function HeaderNav() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();
    const { data: session } = useSession();

    return (
        <header className="fixed top-0 left-0 right-0 h-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg z-50 border-b border-gray-200/50 dark:border-gray-800/50">
            <div className="container mx-auto h-full px-4 lg:px-6 xl:px-8 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative">
                        <img
                            src={theme === "dark" ? "/images/logo-dark.png" : "/images/logo.png"}
                            alt="PronoCrew"
                            className="h-12 w-12 lg:h-14 lg:w-14 object-contain transition-transform group-hover:scale-105"
                        />
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-all duration-300" />
                    </div>
                    <div className="hidden lg:block">
                        <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                            PronoCrew
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">
                            Pronostics Football
                        </p>
                    </div>
                </Link>

                {/* Navigation Desktop */}
                <nav className="hidden xl:flex items-center gap-2 lg:gap-8">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`group relative px-3 py-2 text-sm font-semibold transition-all duration-300 ${
                                    isActive
                                        ? "text-blue-600 dark:text-blue-400"
                                        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                }`}
                            >
                                {item.label}
                                {isActive && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full scale-x-100 group-hover:scale-x-100 transition-transform origin-center" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Actions droites */}
                <div className="flex items-center gap-2 lg:gap-4">

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-700 hover:shadow-md transition-all duration-300 text-gray-700 dark:text-gray-300 hover:text-blue-600"
                        title="Changer le thème"
                        aria-label="Toggle dark mode"
                    >
                        {theme === "dark" ? (
                            <Sun className="w-5 h-5" />
                        ) : (
                            <Moon className="w-5 h-5" />
                        )}
                    </button>

                    {/* Mobile Menu Button */}
                    <button className="xl:hidden p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-white hover:shadow-md transition-all duration-300">
                        <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                    </button>

                    {/* User Actions */}
                    <div className="flex items-center gap-1">
                        {session?.user ? (
                            <Link
                                href="/account"
                                className="group relative flex items-center gap-2 px-4 py-2.5 lg:px-6 lg:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-sm lg:text-base hover:-translate-y-0.5 transform"
                            >
                                <UserIcon className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform" />
                                <span>Mon compte</span>
                                <ChevronDown className="w-3 h-3 hidden lg:block opacity-70" />
                            </Link>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="flex items-center gap-2 px-4 py-2.5 lg:px-6 lg:py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-sm lg:text-base hover:-translate-y-0.5 transform"
                            >
                                <LogInIcon className="w-4 h-4 lg:w-5 lg:h-5" />
                                <span>Se connecter</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
