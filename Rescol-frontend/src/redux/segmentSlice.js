import { createSlice } from "@reduxjs/toolkit";

// Estado inicial del slice
const initialState = {
    id: 0 // Valor inicial del id
}

// Creación del slice
export const segmentSlice = createSlice({
    name: 'segmentId', // Nombre del slice
    initialState, // Estado inicial
    reducers: {
        // Reducer para cambiar el id
        changeId: (state, action) => {
            const { id } = action.payload; // Extrae id del payload
            state.id = id; // Actualiza el estado con el nuevo id
        }
    }
});

// Exporta las acciones del slice
export const { changeId } = segmentSlice.actions;

// Exporta el reducer del slice
export default segmentSlice.reducer;
