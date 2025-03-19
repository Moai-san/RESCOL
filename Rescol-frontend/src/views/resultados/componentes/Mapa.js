import React, { useRef, useEffect, useState } from 'react';
import { MapContainer, TileLayer, FeatureGroup, GeoJSON, Popup, Marker, Polyline, Pane} from 'react-leaflet';
import { useMapContext } from '../../../providers/DataProvider';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import L from 'leaflet'
import { makeIcon, inicio, fin } from '../assets/Icons';

const MapRoutes = React.memo(() => {
  const position = [-33.43912288624236, -70.67521211218381];
  const featureGroupRef = useRef(null);
  const mapRef = useMapContext();
  const history = useLocation();
  const urlParams = useParams();


  const [segmentData, setSegmentData] = useState(null)


  const [geoJson, setGeoJson] = useState(null)

  //CONTROL DE SEGMENTOS
  useEffect(()=>{
    if(history.state && Object.keys(history.state).length > 1 && history.state.segmentos){
      setSegmentData(history.state.segmentos)
    }else{
      setSegmentData(null)
    }
  },[history])

  useEffect(()=>{
    const map = mapRef.current
    // Primero, eliminamos todos los tooltips existentes
    map && map.eachLayer(layer => {
      if (layer instanceof L.Tooltip) {
        map.removeLayer(layer);
      }
    });

    if(map && segmentData){
      let cent = {id: segmentData.id, centroid: []}
      
      const zonas = Object.keys(segmentData.colores)
      

      for(let i=0; i<zonas.length; i++){

        const features = segmentData.data.features.filter(item => item.properties.zona === zonas[i])

        var geojson = {
          "type":"FeatureCollection",
          "features": features
        }

        const bounds = L.geoJSON(geojson).getBounds()
      
        // Calcular el centro del polígono
        const center = bounds.getCenter()

        cent.centroid.push({x: center.lat, y:center.lng})

        // Crear un tooltip en el centro del polígono
        L.tooltip({
          permanent: true,
          direction: 'center',
          className: zonas[i]=== `S${i+1}` && 'custom-tooltip-class',
          offset: [0, 0] // Ajusta el offset según sea necesario
        })
        .setContent(zonas[i])
        .setLatLng(center)
        .addTo(map);
      
      }
    }
  },[segmentData, geoJson])

  //CONTROL DE RUTA
  const [routeGeoData, setRouteGeoData] = useState(null)

  useEffect(()=>{
    if(history.state && Object.keys(history.state).length > 1 && history.state.routeData){
      setRouteGeoData(history.state.routeData.routes[urlParams.ruta-1])
    } 
    else{
      setRouteGeoData(null) 
    }

  },[segmentData])

  useEffect(()=>{
    if(routeGeoData){
        const drawNormalRoute = () => {
          var geojson = {
                            "type":"FeatureCollection",
                            "features":[]
                          }
            
          routeGeoData.forEach((item) => {
      
            var geoType;
            var coords;
  
            if(item.giro){
              geoType = "Point"
              coords  = [item.COORDENADAS[1],item.COORDENADAS[0]]
            }else{
              geoType = "LineString"
              coords  = item.COORDENADAS.map((coord) => [coord[1], coord[0]])
            }
            const feature = {
              "id"  : item.id,
              "type": "Feature",
              "opcional": item.opcional?item.opcional:false,
              "giro": item.giro,
              "geometry": {
                "type": geoType,
                "coordinates": coords
              }
            }
      
            geojson.features.push(feature)
          })
        
          setGeoJson(geojson)
        };
        drawNormalRoute()
      }else{
        setGeoJson(null)
      }
    },[routeGeoData])

    //CONTROL DE INSTRUCCIONES
    const sectionIndex = useSelector((state) => state.sectionId.id)
    
    const drawSelectedRoute = () => {
        const route = routeGeoData[sectionIndex]
        if(route.giro){
          const sentAnte = routeGeoData[sectionIndex-1].sentido
          const sentPost = routeGeoData[sectionIndex+1].sentido
          return(
            <Marker position={route.COORDENADAS} 
                    key={`marker_${route.id}_turn`} 
                    icon={makeIcon(sentAnte,sentPost)}
            >
              <Popup>{sentAnte} {sentPost}</Popup>
            </Marker>
          )
        }else{
          const startPosition = route.coord_i;
          const endPosition = route.coord_f  
          return (
              <Pane name={`celle-${route.id}`}>
                <Marker position={startPosition} 
                        key={`marker_${route.id}_start`} 
                        icon={inicio}
                >
                  <Popup>Inicio</Popup>
                </Marker>
                <Polyline
                pathOptions={{ color: 'red' }}
                positions={route.COORDENADAS}
                key={`line_${route.id}`}
                />
                <Marker position={endPosition} 
                        key={`marker_${route.id}_end`} 
                        icon={fin}
                        >
                  <Popup>Fin</Popup>
                </Marker>
                </Pane>
          );
  
        }
    }

  //ENFOQUE MAPA
  const [display, setDisplay] = useState(true)

  useEffect(()=>{
    const map = mapRef.current
    if(map && geoJson){
      map && map.eachLayer(layer => {
        if (layer instanceof L.Tooltip) {
          map.removeLayer(layer);
        }
      });

      const bounds = L.geoJSON(geoJson).getBounds()
      map.fitBounds(bounds)
      setDisplay(false)

    } else if(map && segmentData){
      const bounds = L.geoJSON(segmentData.data).getBounds()
      map.fitBounds(bounds) 
      setDisplay(true)
    } else if (map) {
      map.flyTo(position, 12, {
        duration: 0.5, // Duration of the animation in seconds
      })
      setDisplay(true)
    }
  },[segmentData, geoJson])


  //CONTROL DE ESTILOS PARA LOS GEOJSON
  const segmentStyle = (feature) => {
    const zonas = feature.properties['zona'];
    return {
      fillColor: 'black',
      weight: 3,  // Ancho de la línea principal
      opacity: 1,
      color: segmentData.colores[zonas],  // Color de la línea principal
      fillOpacity: 1,
    };
  }

  const style = (feature) => {
   
    const opcional = feature['opcional'];
    const giro = feature['giro'];

    if(opcional && !giro){
      return {
        weight: 3,
        opacity: 1,
        fillOpacity: 1,
        color: 'orange'
      };
    }
  };


  return (
    <MapContainer center={position} ref={mapRef} zoom={12} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <FeatureGroup ref={featureGroupRef}>
        {display && segmentData && <GeoJSON key={"segments"} data={segmentData.data} style={segmentStyle}/>}
        {!display && geoJson && routeGeoData && drawSelectedRoute()}
        {!display && geoJson && routeGeoData && <GeoJSON key={"mapa"} data={geoJson} style={style} pointToLayer={(feature, latlng) => {
            // Devuelve null para que no se muestren puntos en el mapa
            return null;
          }}/>}
      </FeatureGroup>
    </MapContainer>
  );
});

export default MapRoutes;





/*
//Faltan calles opcionales
    useEffect(()=>{
      if(segmentData){
        const data = segmentData.data
        var geojson = {
          "type":"FeatureCollection",
          "features":[]
        }
        geojson.features = data.features.filter(item => item.properties.zona === 'S1')
        setGeoJson(geojson)
      }
      
    },[segmentData])
    {//route && drawSelectedRoute()}
*/


