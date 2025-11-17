"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, List, User } from "lucide-react";

const bottomNavItems = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/blog", label: "Actualites", icon: List },
    { href: "/pots", label: "Jouer", icon: Trophy },
    { href: "/account", label: "Compte", icon: User },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 shadow-inner z-50 transition-colors duration-300">
            <div className="grid grid-cols-4 h-full">
                {bottomNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center text-xs transition-colors duration-300 ${
                                isActive
                                    ? "text-blue-600 dark:text-blue-400"
                                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                            }`}
                        >
                            <Icon size={20} />
                            {item.label}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
