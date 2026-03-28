import type { Metadata } from 'next';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'; // shadcn
import LayoutWrapper from "../components/layout/LayoutWrapper";
import React from "react";
import {AdminSidebar} from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";

interface Props {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <LayoutWrapper variant="admin"> <div className="flex h-screen bg-background/95 backdrop-blur-sm">
        {/* Sidebar */}
        <SidebarProvider>
            <AdminSidebar />
            <SidebarTrigger className="lg:hidden" /> {/* Mobile toggle */}
        </SidebarProvider>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
            <AdminHeader />
            <main className="flex-1 overflow-auto p-6 lg:p-8">
                {children}
            </main>
        </div>
    </div></LayoutWrapper>;
}