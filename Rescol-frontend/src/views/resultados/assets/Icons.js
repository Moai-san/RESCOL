//Marcadores
import startIcon from '../assets/startPoint.svg'
import endIcon from '../assets/endPoint.svg'
import lTurnIcon from '../assets/leftTurn.svg'
import TurnRightIcon from '@mui/icons-material/TurnRight';
import NorthIcon from '@mui/icons-material/North';
import UTurnRightIcon from '@mui/icons-material/UTurnRight';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import '../styles/mapa.scss'

// Define el icono personalizado
export const inicio = new L.Icon({
    iconUrl: startIcon, // Ruta a tu imagen de icono personalizada
    iconSize: [25, 25], // Tamaño del icono [ancho, alto]
    iconAnchor: [12.5, 25], // Punto de anclaje del icono relativo a su posición [x, y]
    popupAnchor: [0, -25] // Punto donde debería abrirse el popup relativo a la posición del icono [x, y]
  });

export const fin = new L.Icon({
    iconUrl: endIcon, // Ruta a tu imagen de icono personalizada
    iconSize: [25, 25], // Tamaño del icono [ancho, alto]
    iconAnchor: [12.5, 25], // Punto de anclaje del icono relativo a su posición [x, y]
    popupAnchor: [0, -25] // Punto donde debería abrirse el popup relativo a la posición del icono [x, y]
  });

export const lturn = new L.Icon({
    iconUrl: lTurnIcon, // Ruta a tu imagen de icono personalizada
    iconSize: [20, 20], // Tamaño del icono [ancho, alto]
    iconAnchor: [9, 9], // Punto de anclaje del icono relativo a su posición [x, y]
    popupAnchor: [0, -9] // Punto donde debería abrirse el popup relativo a la posición del icono [x, y]
  });

export  const rightMarkup = renderToStaticMarkup(
    <TurnRightIcon style={{ color: 'black' }} />
  );

export const stayFrontMarkup = renderToStaticMarkup(
    <NorthIcon style={{ color: 'black' }} />
  );

export const UTurnMarkup = renderToStaticMarkup(
    <UTurnRightIcon style={{ color: 'black' }} />
  );



export function makeIcon (ante, post) {

    let icon;
    var rotation = 0;
    var mirrorX = 1
    var mirrorY = 1
    const b = ante === post

    
    if(b){ 
      icon = stayFrontMarkup
      if(post === 'Este') rotation = 90
      else if(post === 'Oeste') rotation = -90
      else if(post === 'Sur') rotation = 180
    }
    else{ 
      icon = rightMarkup
      if(ante === 'Norte' && post === 'Este'){//
      }
      else if(ante === 'Norte' && post === 'Oeste'){//
        mirrorX = -1
      } 
      else if(ante === 'Sur' && post === 'Este'){//
        mirrorY = -1 
      } 
      else if(ante === 'Sur' && post === 'Oeste'){//
        mirrorY = -1
        mirrorX = -1
      } 
      else if(ante === 'Oeste' && post === 'Norte'){//
        rotation = -90
      } 
      else if(ante === 'Oeste' && post === 'Sur'){//
        mirrorY = -1
        rotation = 90
      } 
      else if(ante === 'Este' && post === 'Norte'){//
        mirrorY = -1
        rotation=-90
      }
      else if(ante === 'Este' && post === 'Sur'){ //
        rotation=90
      }
      else{
        icon = UTurnMarkup
      }
    }
    
    return L.divIcon({
      className: 'custom-icon',
      html: `<div class="marker-icon" style="transform: rotate(${rotation}deg) scaleX(${mirrorX}) scaleY(${mirrorY})">
                ${icon}
            </div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -10],
      
    });
  }