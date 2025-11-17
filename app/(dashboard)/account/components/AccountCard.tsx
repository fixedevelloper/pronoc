'use client';

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function AccountCard() {
    const { data: session } = useSession();


    return (
        <div className="mx-auto mt-10 space-y-10 px-4 grid">

        </div>
    );
}
