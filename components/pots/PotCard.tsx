import Link from "next/link";

export default function PotCard({ pot }: { pot: any }) {
    return (
        <Link href={`/pots/${pot.id}`}>
            <div className="p-4 bg-white rounded shadow hover:shadow-md transition cursor-pointer">
                <h2 className="text-xl font-semibold">{pot.name}</h2>
                <p>Type: {pot.type}</p>
                <p>Frais d'entrée: {pot.entry_fee} €</p>
            </div>
        </Link>
    );
}
