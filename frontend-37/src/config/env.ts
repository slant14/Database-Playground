const isProd = import.meta.env.VITE_PROD === "true";

export const API_URL = isProd ? "https://api.dbpg.ru" : "http://localhost:8000";
