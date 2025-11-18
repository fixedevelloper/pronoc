"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {useSnackbar} from "notistack";


export default function WaitingPaiement() {
  const router = useRouter();
  const referenceId = typeof window !== "undefined" ? localStorage.getItem("referenceId") : null;
  const { enqueueSnackbar } = useSnackbar();
  const [statusMessage, setStatusMessage] = useState("Validation du paiement en cours...");
  const [attempts, setAttempts] = useState(0);

  const CHECK_INTERVAL = 5000; // 5 secondes
  const MAX_ATTEMPTS = 12; // 1 minute

  useEffect(() => {
    if (!referenceId) {
      router.push("/accounts");
      return;
    }

    let isCancelled = false;
    const controller = new AbortController();
    let intervalId: NodeJS.Timeout;

    const checkPaymentStatus = async () => {
      try {
        console.log("🔄 Vérification du paiement...");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/pay/status/${referenceId}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error("Erreur réseau ou serveur");

        const data = await res.json();
        if (isCancelled) return;

        if (data.status === "confirmed") {
          clearInterval(intervalId);
          setStatusMessage("✅ Dépôt effectué avec succès !");
          enqueueSnackbar('✅ Dépôt confirmé avec succès', { variant: "success" });
          setTimeout(() => router.push("/account"), 1000);
          return;
        }

        if (data.status === "failed") {
          clearInterval(intervalId);
          enqueueSnackbar('Erreur lors de la vérification', { variant: "error" });
          router.push("/account");
          return;
        }

        setAttempts((prev) => {
          const next = prev + 1;
          if (next >= MAX_ATTEMPTS) {
            clearInterval(intervalId);
            enqueueSnackbar('Delai d attente depasse', { variant: "error" });
            router.push("/account");
          }
          return next;
        });

      } catch (error) {
        console.error("⚠️ Erreur lors de la vérification :", error);
        setStatusMessage("Erreur de connexion. Nouvelle tentative...");
        enqueueSnackbar('Erreur lors de la vérification', { variant: "error" });
        router.push("/account");
        return;
      }
    };

    intervalId = setInterval(checkPaymentStatus, CHECK_INTERVAL);
    checkPaymentStatus(); // Premier appel immédiat

    return () => {
      isCancelled = true;
      controller.abort();
      clearInterval(intervalId);
    };
  }, [referenceId]);

  return (
      <div className="min-h-screen bg-gray-100 pb-20 flex flex-col">
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-5">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#014d74] border-solid"></div>
      <h2 className="mt-8 text-xl font-semibold text-gray-700">{statusMessage}</h2>
      <p className="mt-2 text-gray-500 text-sm text-center">
        Veuillez patienter pendant la confirmation de votre transaction mobile.
      </p>
      <p className="mt-2 text-gray-400 text-xs">Tentative {attempts}/{MAX_ATTEMPTS}</p>
    </div>
      </div>
  );
}
