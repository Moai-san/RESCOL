import { configureStore } from "@reduxjs/toolkit";
import segmentReducer from "./segmentSlice";
import sectionReducer from "./sectionSlice";

// Configuración de la tienda Redux
export const store = configureStore({
    reducer: {
        segmentId: segmentReducer, // Asegúrate de usar segmentReducer aquí
        sectionId: sectionReducer, // Asegúrate de usar segmentReducer aquí
    }
});
