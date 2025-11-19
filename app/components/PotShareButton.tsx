import { useState } from "react";
import Link from "next/link";
import {Pot} from "../types/types";


export default function PotShareButton({ pot }: { pot: Pot }) {

    const [open, setOpen] = useState(false);
    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/pots/${pot.id}`;
    const text = `Rejoins ce pot : ${pot.name}`;
    return (
        <div className="relative">
            {/* MAIN BUTTON */}
            <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                onClick={() => setOpen(!open)}
            >
                Partager
            </button>

            {/* DROPDOWN */}
            {open && (
                <div className="absolute mt-2 w-48 bg-white border rounded-lg shadow-lg z-20 p-2 flex flex-col gap-2">

                    {/* WHATSAPP */}
                    <a
                        href={`https://wa.me/?text=${encodeURIComponent(text + " " + shareUrl)}`}
                        target="_blank"
                        className="p-2 rounded hover:bg-gray-100 flex items-center gap-2"
                    >
                        <span>📱 WhatsApp</span>
                    </a>

                    {/* TELEGRAM */}
                    <a
                        href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`}
                        target="_blank"
                        className="p-2 rounded hover:bg-gray-100 flex items-center gap-2"
                    >
                        <span>✈️ Telegram</span>
                    </a>

                    {/* FACEBOOK */}
                    <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        className="p-2 rounded hover:bg-gray-100 flex items-center gap-2"
                    >
                        <span>📘 Facebook</span>
                    </a>

                    {/* TWITTER / X */}
                    <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`}
                        target="_blank"
                        className="p-2 rounded hover:bg-gray-100 flex items-center gap-2"
                    >
                        <span>🐦 Twitter</span>
                    </a>

                    {/* COPY LINK */}
                    <button
                        className="p-2 rounded hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => navigator.clipboard.writeText(shareUrl)}
                    >
                        <span>🔗 Copier le lien</span>
                    </button>
                </div>
            )}
        </div>
    );
}
