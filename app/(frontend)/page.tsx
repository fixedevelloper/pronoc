import { Metadata } from "next";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import React from "react";
import HomePage from "../../components/HomePage";

export const metadata: Metadata = {
  title: 'Accueil | PronoCrew',
  description: 'Pronostics football IA + paris mutuels Cameroun'
};

export default function Home() {
  return (
      <LayoutWrapper variant="frontend">
        <HomePage />
      </LayoutWrapper>
  );
}