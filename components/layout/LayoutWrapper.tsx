'use client';

import React from "react";

interface LayoutWrapperProps {
    children: React.ReactNode;
    variant?: 'frontend' | 'auth' | 'admin';
    className?: string;
}

export default function LayoutWrapper({
                                          children,
                                          variant = 'auth',
                                          className = ''
                                      }: LayoutWrapperProps) {

    const variants = {
        auth: 'flex items-center justify-center min-h-screen p-4 sm:p-8 lg:p-12 bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50',
      //  admin: 'flex flex-col h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-gray-50',
        // Frontend: PAS ICI (géré par FrontendLayout)
    };

    return (
        <div className={`${variants[variant as keyof typeof variants] || ''} ${className}`}>
            {children}
        </div>
    );
}