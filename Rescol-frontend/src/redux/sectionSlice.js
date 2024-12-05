import { createSlice } from "@reduxjs/toolkit";

// Estado inicial del slice
const initialState = {
    id: 0 // Valor inicial del id
}

// Creación del slice
export const sectionSlice = createSlice({
    name: 'sectionId', // Nombre del slice
    initialState, // Estado inicial
    reducers: {
        // Reducer para cambiar el id
        changeSection: (state, action) => {
            const { id } = action.payload; // Extrae id del payload
            state.id = id; // Actualiza el estado con el nuevo id
        }
    }
});

// Exporta las acciones del slice
export const { changeSection } = sectionSlice.actions;

// Exporta el reducer del slice
export default sectionSlice.reducer;
