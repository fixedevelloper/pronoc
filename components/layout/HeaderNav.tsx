'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeContext";
import { useSession } from "next-auth/react";
import {
    LogInIcon, UserIcon, Menu, Sun, Moon, ChevronDown, Volleyball, X
} from "lucide-react";
import { Sheet, SheetContent, SheetClose, SheetTrigger } from "@/components/ui/sheet";
import {cn} from "../../lib/utils";

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
    const { data: session, status } = useSession();

    // Loading state
    if (status === 'loading') {
        return (
            <header className="fixed top-0 left-0 right-0 h-20 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 backdrop-blur-xl z-50 animate-pulse border-b" />
        );
    }

    return (
        <header className="fixed top-0 left-0 right-0 h-20 lg:h-24 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg z-50 border-b border-gray-200/50 dark:border-gray-800/50">
            <div className="container mx-auto h-full px-4 lg:px-6 xl:px-8 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group/logo">
                    <div className="relative p-2 group-hover:p-2.5 transition-all">
                        <img
                            src={theme === "dark" ? "/images/logo-dark.png" : "/images/logo.png"}
                            alt="PronoCrew"
                            className="h-12 w-12 lg:h-14 lg:w-14 object-contain transition-transform group-hover/logo:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 rounded-2xl blur opacity-0 group-hover/logo:opacity-30 transition-all duration-300" />
                    </div>
                    <div className="hidden lg:block">
                        <h1 className="text-xl lg:text-2xl font-black bg-gradient-to-r from-gray-900 via-emerald-600 to-gray-700 dark:from-white dark:via-emerald-400 dark:to-gray-200 bg-clip-text text-transparent tracking-tight">
                            PronoCrew
                        </h1>
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">
                            Pronostics Football IA
                        </p>
                    </div>
                </Link>

                {/* Navigation Desktop */}
                <nav className="hidden xl:flex items-center gap-1 lg:gap-8 mx-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "group relative px-4 py-2 lg:px-5 lg:py-3 text-sm lg:text-base font-semibold transition-all duration-300 rounded-xl",
                                    isActive
                                        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 backdrop-blur-sm shadow-md"
                                        : "text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/5"
                                )}
                            >
                                {item.label}
                                {isActive && (
                                    <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-sm rounded-xl -z-10 animate-pulse" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Actions droites */}
                <div className="flex items-center gap-2 lg:gap-3">

                    {/* Thème Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 lg:p-3 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-0.5 transition-all duration-300 text-gray-700 dark:text-gray-300 hover:text-emerald-600"
                        title={theme === "dark" ? "Mode clair" : "Mode sombre"}
                        aria-label="Toggle dark mode"
                    >
                        {theme === "dark" ? (
                            <Sun className="w-5 h-5 lg:w-6 lg:h-6" />
                        ) : (
                            <Moon className="w-5 h-5 lg:w-6 lg:h-6" />
                        )}
                    </button>

                    {/* Mobile Menu */}
                    <Sheet>
                        <SheetTrigger>
                            <button className="p-2.5 lg:p-3 xl:hidden rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-0.5 transition-all duration-300">
                                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="right" className="p-0 w-80 sm:w-96 bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border-l border-gray-200/50 dark:border-gray-800/50">
                            <div className="flex flex-col h-full">
                                {/* Header Sheet */}
                                <div className="sticky top-0 p-6 border-b border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-r from-emerald-500/10 to-blue-500/10">
                                    <div className="flex items-center justify-between mb-6">
                                        <Link href="/" className="flex items-center gap-3 p-3 -m-3 rounded-2xl hover:bg-white/50 transition-all">
                                            <Volleyball className="h-10 w-10 text-emerald-600 shadow-lg" />
                                            <div>
                                                <h2 className="font-black text-xl text-emerald-900 drop-shadow-lg">PronoCrew</h2>
                                                <p className="text-emerald-700 text-sm font-semibold tracking-wide">Pronostics ⚽ IA</p>
                                            </div>
                                        </Link>
                                        <SheetClose>
                                            <button className="p-2 rounded-xl hover:bg-white/50 transition-all">
                                                <X className="w-6 h-6 text-gray-600 hover:text-gray-900" />
                                            </button>
                                        </SheetClose>
                                    </div>
                                </div>

                                {/* Navigation */}
                                <nav className="flex-1 p-6 pb-12 overflow-y-auto space-y-2">
                                    {navItems.map((item) => {
                                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                                        return (
                                            <SheetClose key={item.href} >
                                                <Link
                                                    href={item.href}
                                                    className={cn(
                                                        "group block w-full p-4 rounded-2xl transition-all duration-300 font-semibold text-base",
                                                        isActive
                                                            ? "bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-700 shadow-lg border-2 border-emerald-500/30 backdrop-blur-sm"
                                                            : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-500/10 dark:text-gray-300 dark:hover:text-emerald-400 dark:hover:bg-emerald-500/20"
                                                    )}
                                                >
                                                    <span className="flex items-center gap-3">
                                                        <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-emerald-500 shadow-lg' : 'bg-gray-300 dark:bg-gray-600'}`} />
                                                        {item.label}
                                                    </span>
                                                </Link>
                                            </SheetClose>
                                        );
                                    })}
                                </nav>

                                {/* Profile Section */}
                                <div className="p-6 border-t border-gray-200/30 dark:border-gray-800/30 bg-gradient-to-t from-slate-50/50 dark:from-gray-900/50 sticky bottom-0 backdrop-blur-sm">
                                    {session?.user ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4 p-4 bg-white/70 dark:bg-gray-800/70 rounded-2xl backdrop-blur-sm shadow-lg">
                                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl">
                                                    <UserIcon className="w-8 h-8 text-white drop-shadow-lg" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-bold text-lg text-gray-900 dark:text-white truncate">{session.user.name}</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{session.user.email}</p>
                                                </div>
                                            </div>
                                            <SheetClose>
                                                <Link
                                                    href="/account"
                                                    className="w-full block text-center py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-emerald-600/50"
                                                >
                                                    Mon Compte
                                                </Link>
                                            </SheetClose>
                                        </div>
                                    ) : (
                                        <SheetClose>
                                            <Link
                                                href="/auth/login"
                                                className="w-full block text-center py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-emerald-600/50"
                                            >
                                                Se Connecter Gratuitement
                                            </Link>
                                        </SheetClose>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* Desktop User Actions */}
                    <div className="hidden lg:flex items-center gap-2">
                        {session?.user ? (
                            <Link
                                href="/account"
                                className="group relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 font-semibold text-sm hover:-translate-y-1 transform border border-blue-600/30 backdrop-blur-sm"
                            >
                                <UserIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span>Mon compte</span>
                                <ChevronDown className="w-4 h-4 opacity-80 ml-1 transition-transform group-hover:rotate-180" />
                            </Link>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 font-semibold text-sm hover:-translate-y-1 transform border border-emerald-600/30 backdrop-blur-sm"
                            >
                                <LogInIcon className="w-5 h-5" />
                                <span>Se connecter</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}