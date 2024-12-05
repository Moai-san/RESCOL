import React from 'react';
import { ReactComponent as TruckSVG } from '../assets/camion2.svg';
import '../styles/truckfill.css'; // Archivo CSS para estilos
import { Typography } from '@mui/material';

const TruckFill = ({ percentage }) => {

    return (
      <div className="truck-container" style={{
          background: `linear-gradient(to right, #4CAF50 ${percentage}%, #f0f0f0 ${percentage}%)`
  
      }}>
          <TruckSVG className="truck-image"/>
          <Typography className="percentage-text">{Number.parseFloat((percentage).toFixed(2)).toLocaleString('es')}%</Typography>
      </div>
    );
  };
  
  export default TruckFill;

/*
const TruckFill = ({ percentage }) => {

  return (
    <div className="truck-container" style={{
        background: `linear-gradient(to right, #4CAF50 ${percentage}%, #f0f0f0 ${percentage}%)`

    }}>
        <TruckSVG className="truck-image"/>
        <Typography className="percentage-text">{Number.parseFloat((percentage).toFixed(2)).toLocaleString('es')}%</Typography>
    </div>
  );
};

export default TruckFill;
*/




