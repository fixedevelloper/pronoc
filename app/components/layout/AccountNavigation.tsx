"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    PlusCircle,
    Wallet,
    ListChecks,
    ArrowLeftRight
} from "lucide-react";

export default function AccountNavigation() {

    const pathname = usePathname();

    const links = [
        { label: "Dashboard", href: "/account", icon: LayoutDashboard },
        { label: "Créer un pot", href: "/account/pots/create", icon: PlusCircle },
        { label: "Mes Pots", href: "/account/pots", icon: Wallet },
        { label: "Mes Pronostics", href: "/account/pronostics", icon: ListChecks },
        { label: "Mes transactions", href: "/account/transactions", icon: ArrowLeftRight },
    ];

    return (
        <ul className="flex flex-col gap-1 bg-card p-4 rounded-xl shadow-lg border dark:border-gray-700">
            {links.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                    <li key={item.href}>
                        <Link
                            href={item.href}
                            className={`
                                flex items-center gap-3 p-3 rounded-lg transition-all
                                ${isActive
                                ? "bg-blue-600 text-white shadow-md"
                                : "hover:bg-blue-50 dark:hover:bg-gray-700 text-theme"
                            }
                            `}
                        >
                            <Icon size={20} className={isActive ? "text-theme" : "text-gray-500 dark:text-theme"} />
                            <span className="font-medium">{item.label}</span>
                        </Link>

                        {/* Divider sauf le dernier */}
                        {index < links.length - 1 && (
                            <div className="border-b border-gray-200 dark:border-gray-700 my-2"></div>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}
