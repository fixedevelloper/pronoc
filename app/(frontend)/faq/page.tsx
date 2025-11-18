"use client";

import { useState } from "react";
import Script from "next/script";

export default function FaqPage() {
    const faqs = [
        {
            q: "Comment fonctionne un pot ?",
            a: "Vous rejoignez un pot, vous faites vos pronostics, et les gagnants sont automatiquement calculés en fonction des points obtenus."
        },
        {
            q: "Comment sont calculés les points ?",
            a: "Chaque pronostic correct rapporte un certain nombre de points. Le classement se met ensuite à jour automatiquement en temps réel."
        },
        {
            q: "Comment retirer mes gains ?",
            a: "Vous pouvez retirer vos gains à tout moment via Mobile Money ou virement bancaire, de manière simple et rapide."
        }
    ];

    const [open, setOpen] = useState(null);

    const toggle = (i) => {
        setOpen(open === i ? null : i);
    };

    // JSON-LD FAQ Schema
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map((faq) => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a
            }
        }))
    };

    return (
        <section className="space-y-12 py-16">

            {/* ───── SCRIPT SEO JSON-LD POUR GOOGLE ───── */}
            <Script
                id="faq-schema"
                type="application/ld+json"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            {/* ────────────────────────────────────────── */}


            <div className="max-w-3xl mx-auto px-6 text-theme">

                {/* HEADER */}
                <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
                    FAQ – Questions fréquentes
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Retrouvez ici toutes les réponses aux questions les plus posées par nos utilisateurs.
                </p>

                {/* LISTE FAQ */}
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className="bg-card p-5 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition"
                        >
                            {/* QUESTION */}
                            <button
                                onClick={() => toggle(i)}
                                className="flex justify-between w-full text-left font-semibold text-theme text-lg"
                                aria-expanded={open === i}
                            >
                                {faq.q}
                                <span className="text-primary">
                                    {open === i ? "−" : "+"}
                                </span>
                            </button>

                            {/* RÉPONSE */}
                            <div
                                className={`overflow-hidden transition-all duration-300 ${
                                    open === i ? "max-h-40 mt-2" : "max-h-0"
                                }`}
                            >
                                <p className="text-gray-600 dark:text-gray-300">
                                    {faq.a}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
