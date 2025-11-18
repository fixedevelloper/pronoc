export default function BlogPage() {
    return (
        <section className="space-y-10 py-16">
            {/* HEADER */}
            <div className="max-w-6xl mx-auto px-6 text-theme">
                <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
                    Derniers articles
                </h1>

                <p className="text-gray-600 max-w-2xl">
                    Découvrez nos conseils, analyses et astuces pour mieux pronostiquer et maximiser vos gains
                    sur PronoCrew.
                </p>
            </div>

            {/* LISTE ARTICLES */}
            <section className="max-w-6xl mx-auto px-6">
                <div className="grid md:grid-cols-3 gap-8">
                    {[1,2,3].map((i) => (
                        <div
                            key={i}
                            className="bg-card rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-200 dark:border-gray-700"
                        >
                            {/* IMAGE PLACEHOLDER */}
                            <div className="h-40 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 mb-4" />

                            <h3 className="font-semibold text-lg text-theme">
                                Comment améliorer vos pronostics {i}
                            </h3>

                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-theme">
                                Découvrez les meilleures méthodes utilisées par les parieurs pour analyser les matchs
                                et augmenter leurs chances de gains.
                            </p>

                            <a
                                href={`/blog/article-${i}`}
                                className="text-primary mt-4 block font-medium hover:underline"
                            >
                                Lire l’article →
                            </a>
                        </div>
                    ))}
                </div>
            </section>
        </section>
    );
}
