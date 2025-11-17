import PotsGrid from "../../components/pots/PotGrid";

export default function FaqPage() {
    return (
        <section className="space-y-10">

            {/* HEADER / HERO */}
            <div className="p-6 md:p-10  rounded-2xl text-theme">
                <h1 className="text-3xl md:text-4xl font-extrabold">
                    FAQ
                </h1>
                <section className="space-y-6 max-w-3xl mx-auto px-6">
                    {[
                        { q: "Comment fonctionne un pot ?", a: "Vous rejoignez un pot, vous faites vos pronostics, et les gagnants sont automatiquement calculés." },
                        { q: "Comment sont calculés les points ?", a: "Chaque match correct rapporte un point. Le classement se met à jour automatiquement." },
                        { q: "Comment retirer mes gains ?", a: "Vous pouvez retirer vos gains via Mobile Money ou virement." }
                    ].map((faq, i) => (
                        <div key={i} className="p-4 bg-card rounded-lg shadow-lg">
                            <h4 className="font-bold">{faq.q}</h4>
                            <p className="text-gray-600 dark:text-gray-300 mt-1 text-theme">{faq.a}</p>
                        </div>
                    ))}
                </section>

            </div>

        </section>
    );
}