import PotsGrid from "../../components/pots/PotGrid";

export default function BlogPage() {
    return (
        <section className="space-y-10">

            {/* HEADER / HERO */}
            <div className="p-6 md:p-10  rounded-2xl text-theme">
                <h1 className="text-3xl md:text-4xl font-extrabold ">
                    Derniers articles
                </h1>
                <section className="space-y-6 max-w-6xl mx-auto px-6">
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

            </div>

        </section>
    );
}