"use client";
import JoinPotPage from "../../../components/pots/JoinPotPage";
import {useParams} from "next/navigation";


export default function PotsPage() {
    const params = useParams();
    const id = params?.id as string;
    return (
        <section className="space-y-6">
            <JoinPotPage params={id}/>
        </section>
    );
}
