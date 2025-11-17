import axios from "axios";
import { getAuthToken, verifyExpired } from "./tools";

const axiosServices = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    headers: { "Content-Type": "application/json" },                  // si tu utilises cookies/session
});

/**
 * 🔹 Fonction pour configurer les intercepteurs (tu l’appelleras depuis _app.tsx)
 */
export const setupAxiosInterceptors = (enqueueSnackbar: (msg: string, opts?: any) => void) => {
    // ✅ Intercepteur de requêtes
    axiosServices.interceptors.request.use(
        async (config:any) => {
            const token = await getAuthToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            console.info(
                "➡️ [API REQUEST]",
                config.method?.toUpperCase(),
                config.baseURL + config.url,
                config.data || ""
            );

            return config;
        },
        (error) => {
            console.error("❌ [REQUEST ERROR]", error);
            return Promise.reject(error);
        }
    );

    // ✅ Intercepteur de réponses
    axiosServices.interceptors.response.use(
        (response) => {
            console.info("✅ [API RESPONSE]", response);
            return response;
        },
        (error) => {
            const status = error.response?.status;
            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Erreur serveur inattendue";

            // 🔥 Toast automatique avec notistack
            enqueueSnackbar(message, { variant: "error" });

            console.groupCollapsed(`❌ [API ERROR] ${status || ""} ${error.config?.url}`);
            console.error("Message:", message);
            console.error("Status:", status);
            console.error("Response data:", error.response?.data);
            console.error("Request data:", error.config?.data);
            console.groupEnd();

            if (typeof window !== "undefined")  {
                if (status === 403) {
                    
                } else if (status === 401) {
            
                    verifyExpired()
                }
            }
            return Promise.reject({
                status,
                message,
                data: error.response?.data,
            });
        }
    );
};
export default axiosServices;