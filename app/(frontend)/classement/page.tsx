export default function ClassementPage() {
    return (
        <section className="space-y-6">
            <h1 className="text-2xl font-bold text-blue-600">Classement des participants</h1>
            <p className="text-gray-600 dark:text-gray-300">Suivez le classement en temps réel selon les pronostics.</p>

            <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                        <th className="p-3">Rang</th>
                        <th className="p-3">Participant</th>
                        <th className="p-3">Points</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr className="border-t border-gray-200 dark:border-gray-700">
                        <td className="p-3">1</td>
                        <td className="p-3">John Doe</td>
                        <td className="p-3">10</td>
                    </tr>
                    <tr className="border-t border-gray-200 dark:border-gray-700">
                        <td className="p-3">2</td>
                        <td className="p-3">Jane Smith</td>
                        <td className="p-3">8</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </section>
    );
}
