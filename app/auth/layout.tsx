import React from "react";
import LayoutWrapper from "../../components/layout/LayoutWrapper";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return <LayoutWrapper variant="auth">{children}</LayoutWrapper>;
}