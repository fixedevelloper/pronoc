import PotCard from "../../components/pots/PotCard";
import PotsGrid from "../../components/pots/PotGrid";


export default function PotsPage() {
    return (
        <section className="space-y-10">

            {/* HEADER / HERO */}
            <div className="p-6 md:p-10  rounded-2xl text-theme">
                <h1 className="text-3xl md:text-4xl font-extrabold">
                    Pots disponibles
                </h1>

                <p className="mt-2 text-lg opacity-90 text-secondary">
                    Rejoignez un pot, faites vos pronostics et tentez de remporter la cagnotte !
                </p>

            </div>

            {/* GRID DES POTS */}
            <div className="mt-4">
                <PotsGrid />
            </div>
        </section>
    );
}
