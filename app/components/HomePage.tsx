'use client';



export default function HomePage() {
    return (
        <div className="space-y-24 mt-10">

            {/* HERO */}
            <section className="py-24  text-theme">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center px-6">
                    {/* IMAGE */}
                    <div className="flex justify-center">
                        <img
                            src="/images/hero.webp"
                            alt="Prono crew illustration"
                            width={1050}
                            height={650}
                            className="drop-shadow-2xl rounded-xl animate-fadeIn"
                        />
                    </div>

                    {/* TEXTE + CTA */}
                    <div className="text-center md:text-left space-y-6 animate-fadeIn text-theme">
                        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-theme">
                           Prono crew
                        </h1>
                        <p className="text-lg md:text-xl opacity-90 max-w-xl text-theme">
                            Analysez. Pronostiquez. Gagnez. Prono crew vous donne les meilleurs outils
                            pour maximiser vos chances de profit chaque jour — stats avancées, communautés, challenges et pots à rejoindre en un clic.
                        </p>

                        <div className="flex flex-col sm:flex-row sm:justify-start justify-center gap-4 pt-6">
                            <a
                                href="/download"
                                className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow hover:shadow-lg transition"
                            >
                                Télécharger l'application
                            </a>
                            <a
                                href="/pots"
                                className="px-6 py-3 bg-blue-900 font-semibold rounded-lg shadow hover:shadow-lg transition text-white"
                            >
                                Rejoindre un pot
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6 text-theme">
                {[
                    { title: "Pronostics en 1 clic", desc: "Interface intuitive pour pronostiquer rapidement chaque match.", icon: "⚽" },
                    { title: "Pots entre amis", desc: "Rejoignez ou créez des pots pour gagner selon vos résultats.", icon: "🏆" },
                    { title: "Classements automatiques", desc: "Classements mis à jour en temps réel selon vos prédictions.", icon: "📊" }
                ].map((item, i) => (
                    <div key={i} className="p-6 bg-card shadow-lg rounded-lg text-center hover:scale-105 transition-transform duration-300">
                        <div className="text-5xl mb-4">{item.icon}</div>
                        <h3 className="font-bold text-xl text-theme">{item.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-2 text-theme">{item.desc}</p>
                    </div>
                ))}
            </section>

            {/* STATISTIQUES */}
            <section className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6 text-center">
                {[
                    { number: "12K+", label: "Parieurs actifs" },
                    { number: "350K+", label: "Pronostics effectués" },
                    { number: "95%", label: "Taux de satisfaction" }
                ].map((stat, i) => (
                    <div key={i} className="p-8 bg-card shadow-lg rounded-lg hover:scale-105 transition-transform duration-300">
                        <div className="text-4xl font-extrabold text-blue-600">{stat.number}</div>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">{stat.label}</p>
                    </div>
                ))}
            </section>

            {/* TÉMOIGNAGES */}
            <section className="py-20 bg-gray-50 bg-card rounded-2xl mt-10">
                <div className="max-w-12xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-blue-600">Ils parlent de Prono crew</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-300 text-lg text-theme">Découvrez ce que pensent nos utilisateurs</p>

                    <div className="mt-12 grid gap-8 md:grid-cols-3">
                        {[1,2,3].map((i) => (
                            <div key={i} className="bg-card p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
                                <p className="text-gray-700 dark:text-gray-300 italic text-theme">
                                    “Exemple de témoignage numéro {i}. Les utilisateurs adorent l’expérience.”
                                </p>
                                <div className="flex items-center gap-3 mt-6">
                                    <img src={`/images/user${i}.jpg`} className="w-12 h-12 rounded-full object-cover" />
                                    <div className="text-left">
                                        <h4 className="font-semibold text-gray-900 text-theme">Utilisateur {i}</h4>
                                        <span className="text-sm text-gray-500 text-theme">Ville {i}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* BLOG */}
            <section className="space-y-6 max-w-6xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-center">Derniers articles</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {[1,2,3].map((i) => (
                        <div key={i} className="bg-card p-6 rounded-lg shadow-lg hover:shadow-2xl transition">
                            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                            <h3 className="font-semibold text-lg text-theme">Titre de l’article {i}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 text-theme">
                                Petit résumé de l’article pour attirer l’attention du lecteur...
                            </p>
                            <a href="/blog/article" className="text-blue-600 mt-3 block font-medium">Lire →</a>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section className="space-y-6 max-w-3xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-center text-theme">FAQ</h2>
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

            {/* FOOTER */}
            <footer className="py-10 text-center text-theme text-sm">
                Prono crew © {new Date().getFullYear()}. Tous droits réservés.
            </footer>
        </div>

    );
}

