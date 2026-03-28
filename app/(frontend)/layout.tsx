import React from "react";
import LayoutWrapper from "../components/layout/LayoutWrapper";
import HeaderNav from "../components/layout/HeaderNav";

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
    return <LayoutWrapper variant="frontend">
        {children}
    </LayoutWrapper>;
}