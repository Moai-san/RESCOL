// Utilidad React
import {  useRef, useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Tooltip, FeatureGroup, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
// Importa Leaflet y las extensiones necesarias
import L from 'leaflet';
import '../styles/mapa.scss'

import {Switch, FormControlLabel, Typography} from '@mui/material';

function Leaflet({ lineData }) {

  const position = [-33.43912288624236, -70.67521211218381]
  const [heapMap, setHeapMap] = useState(false)
  const zoom = 12

  const mapRef = useRef();  // Obtener la referencia del map


  useEffect(()=>{
    if(mapRef.current){
      const map = mapRef.current

      if(lineData){
        const bounds = L.geoJSON(lineData.data).getBounds()
        map.fitBounds(bounds)
        setHeapMap(false)
      }else{
        map.flyTo(position,zoom)
      }
    }
  },[lineData]) 

  const getColor = (value) => {
    // Definir los colores para cada intervalo
    if(value === null) return '#9b9b9b'
    else if (value <= 75) return '#008f39';
    else if (value <= 200) return '#e5be01';
    else if (value <= 999) return '#ff2c2c';
    else return 'black'; // Color más alto (más basura)
  };
  
  const style = (feature) => {
      const basuraArc = feature.properties['RESIDUOS'];
      return {
        fillColor: 'black',
          weight: 3,  // Ancho de la línea principal
          opacity: 1,
          color: heapMap?getColor(basuraArc):'#239af5',  // Color de la línea principal
          fillOpacity: 1,
      };
  };

  //const testData = {'B 01': '#b4bc1b', 'B 14': '#56c06f', 'A01': '#576c3a', 'B 07': '#c9c663', 'A 02': '#257a65', 'A 15': '#dfa311', 'B 08': '#0c8bc2', 'A 14': '#7bfb48', 'A 04': '#724a17', 'B 13': '#672bd5', 'A 07': '#3992db', 'A 09': '#b50372', 'B 12': '#d00610', 'B 03': '#63dd1d', 'A 12': '#0f92b9', 'A 10': '#182707', 'A 06': '#6a37ea', 'B 09': '#0869d6', 'B 02': '#db26b2', 'B 11': '#25f857', 'B 05': '#3dd370', 'A 08': '#7c006c', 'A 13': '#e7441f', 'A 05': '#d68b72', 'B 06': '#649cbc', 'A 17': '#5d9a82', 'A 18': '#76ab61', 'B 10': '#7d7678', 'A 03': '#15822b', 'A 11': '#7b7592', 'B 04': '#9d7524'}
  const testData = {'N6': '#3714f0', 'N2': '#1c78cb', 'S6': '#c7ed70', 'S8': '#b88647', 'N4': '#1c986a', 'S5.2': '#0bb325', 'N5': '#7d2ab1', 'S1': '#425ed4', 'S10': '#24069b', 'S5.1': '#5225a8', 'S3': '#5cae9a', 'S7': '#bf8876', 'N1': '#83f77c', 'N3': '#574be3', 'S4': '#8701de', 'N7': '#3a62c5', 'S2': '#0f5593', 'S9': '#feea3d', 'N10': '#7f1cba', 'N9': '#1b792a', 'N8': '#e5a2b1', 'Z4': '#d6853b', 'Z5': '#ee266d'}
  
  const richiStyle = (feature) => {
    const zonas = feature.properties['Zonas'];
    return {
            fillColor: 'black',
            weight: 3,  // Ancho de la línea principal
            opacity: 1,
            color: testData[zonas],  // Color de la línea principal
            fillOpacity: 1,
        };
};

  const onEachFeature = (feature, layer) => {
    const basuraArc = feature.properties['RESIDUOS'];
    layer.bindTooltip(`Residuos del arco: ${basuraArc?Number.parseFloat(basuraArc).toFixed(2):0}`);
  };


  const onActivateSwitch = () => {
    setHeapMap(!heapMap)
  }

  return (
    <div className='leaflet'>
      {lineData && 
        <div className='leaflet-button'>
          <FormControlLabel 
                label="Mapa de calor"
                control={<Switch  onChange={onActivateSwitch}/>}
                labelPlacement="start"
          />
          {
            heapMap && 
              <div >
                <Typography>Rango de residuos (kg)</Typography>
                <div className='leaflet-range-item'>
                  <div className='leaflet-grey'/>0
                </div>
                <div className='leaflet-range-item'>
                  <div className='leaflet-green'/> 1 - 75
                </div>
                <div className='leaflet-range-item'>
                  <div className='leaflet-yellow'/> 76 - 200
                </div>
                <div className='leaflet-range-item'>
                  <div className='leaflet-red'/> 201 - 999
                </div>
                <div className='leaflet-range-item'>
                  <div className='leaflet-black'/> {'>= 1000'}
                </div>
              </div>
          }
        </div>
      }
      <MapContainer center={position} zoom={zoom} ref={mapRef} style={{height:'100%', width:'100%'}}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {lineData &&   <GeoJSON key={lineData.id} 
                                data={lineData.data} 
                                style={style}
                                onEachFeature={onEachFeature}/>}
      </MapContainer>
    </div>
  );
}

export default Leaflet;
