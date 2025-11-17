export default function MatchsPage() {
    return (
        <section className="space-y-6">
            <h1 className="text-2xl font-bold text-blue-600">Matchs du jour</h1>
            <p className="text-gray-600 dark:text-gray-300">Faites vos pronostics sur les matchs disponibles.</p>

            <div className="space-y-4 mt-4">
                {/* Exemple de match */}
                <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <span className="font-semibold">FC Barcelone vs Real Madrid</span>
                    <button className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-500">Pronostiquer</button>
                </div>
                <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <span className="font-semibold">PSG vs Lyon</span>
                    <button className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-500">Pronostiquer</button>
                </div>
            </div>
        </section>
    );
}
