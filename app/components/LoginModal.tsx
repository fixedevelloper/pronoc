'use client';
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow w-96">
                <h2 className="text-xl font-bold mb-4">Se connecter</h2>
                <input type="email" placeholder="Email" className="w-full p-2 border mb-2" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Mot de passe" className="w-full p-2 border mb-4" value={password} onChange={e => setPassword(e.target.value)} />
                <button className="w-full bg-blue-600 text-white p-2 rounded" onClick={() => signIn("credentials", { email, password })}>Se connecter</button>
                <button className="mt-2 w-full text-gray-600" onClick={onClose}>Annuler</button>
            </div>
        </div>
    );
}
