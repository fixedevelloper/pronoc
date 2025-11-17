'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import LoginModal from "../../components/LoginModal";
import { useSession } from "next-auth/react";

export default function PotPage() {
    const { id } = useParams();
    const [pot, setPot] = useState<any>(null);
    const [showLogin, setShowLogin] = useState(false);
    const { data: session } = useSession();

    useEffect(() => {
        axios.get(`/api/pots/${id}`).then(res => setPot(res.data));
    }, [id]);

    if (!pot) return <p>Chargement...</p>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">{pot.name}</h1>
            <p>Frais d'entrée: {pot.entry_fee} €</p>



            <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
        </div>
    );
}
