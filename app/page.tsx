
import { Metadata } from "next";
import HomePage from "./components/HomePage";

export const metadata: Metadata = { title: 'Accueil-Skypay' }
export default function Home() {

  return (
   <HomePage></HomePage>
  );
}

