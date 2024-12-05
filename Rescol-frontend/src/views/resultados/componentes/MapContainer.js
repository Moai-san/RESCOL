// MapContainer.js
import React, { useEffect } from 'react';
import MapRoutes from './Mapa';

const MapContainer = () => {

    return (
        <div style={{width:'100%', height:'100%'}}>
            <MapRoutes/>
        </div>
    );
};

export default MapContainer;