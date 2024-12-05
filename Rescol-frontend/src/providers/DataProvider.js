// DataProvider.js
import React, { createContext, useState, useContext, useRef } from "react";

// Crear los contextos
const RouteDataContext = createContext();
const SegmentsContext = createContext();
const NotificationContext = createContext();
const MapContext = createContext()

// Hooks para usar los contextos
export function useRouteDataContext() {
    return useContext(RouteDataContext);
} 

export function useSegmentsContext() {
    return useContext(SegmentsContext);
} 

export function useNotificationContext() {
    return useContext(NotificationContext);
} 

export function useMapContext() {
    return useContext(MapContext);
} 

// Componente proveedor que envuelve los contextos
export const NewDataProvider = ({ children }) => {

    const [routeData, setRouteData] = useState(null);
    const [segmentData, setSegmentData] = useState(null);
    const [notification, setNotification] = useState(null);
    const mapRef = useRef(null)

    return (
        <RouteDataContext.Provider value={[routeData, setRouteData]}>
            <SegmentsContext.Provider value={[segmentData, setSegmentData]}>
                <NotificationContext.Provider value={[notification, setNotification]}>
                    <MapContext.Provider value={mapRef}>
                        {children}
                    </MapContext.Provider>
                </NotificationContext.Provider>
            </SegmentsContext.Provider>
        </RouteDataContext.Provider>
    );
}
