'use client';
import { useSession } from 'next-auth/react';
import { Search, Bell, User, ChevronDown } from 'lucide-react';

import React from "react";
import {Button} from "../ui/button";
import {Input} from "../ui/input";

export default function AdminHeader() {
    const { data: session } = useSession();
    return (
        <header className="border-b bg-background/95 sticky top-0 z-50 p-4 lg:px-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1 max-w-md">
                    <Button variant="ghost" size="icon">
                        <Search className="h-5 w-5" />
                    </Button>
                    <Input placeholder="Rechercher fixtures, users..." className="h-10" />
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex gap-1 text-sm text-muted-foreground">
                        <span>Pots ouverts: 12</span>
                        <span>• Accuracy IA: 78%</span>
                    </div>
                    <Button variant="ghost" size="icon">
                        <Bell className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {session?.user?.name}
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </header>
    );
}