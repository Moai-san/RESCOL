import { Document, Page, StyleSheet, View, Text } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';

export default function PDF({routeInfo}){

    const [horaPost, setHoraPost] = useState(null)

    useEffect(()=>{
        var itinerario = []
        var c = 0
        const time = routeInfo.map(item => item.tiempo)

        for(let i =0; i < time.length; i++){
            itinerario.push({inicio: c, fin: c + time[i]})
            c = c + time[i]
        }

        setHoraPost(itinerario)

    },[routeInfo])

    function segundosAFormatoHora(s) {
        var date = new Date(s * 1000); // Multiplicar por 1000 para convertir segundos a milisegundos
        var horas = date.getUTCHours();
        var minutos = date.getUTCMinutes();
        var segundos = date.getUTCSeconds();
    
        return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    }

    const direcciones = {
        'norte': 0,
        'este': 1,
        'sur': 2,
        'oeste': 3
    };

    // Función para determinar la dirección de giro
    function determinarGiro(direccionActual, nuevaDireccion) {
      // Calcular la diferencia entre las direcciones actual y nueva
      const diferencia = (direcciones[nuevaDireccion] - direcciones[direccionActual] + 4) % 4;
      
      // Determinar el tipo de giro
      if (diferencia === 1) {
        return 'derecha';
      } else if (diferencia === 2) {
        return 'media vuelta';
      } else {
        return 'izquierda';
      }
    }

    const writeInstruct = (data) => {
        const calle_i = data.calle_i.toLowerCase().split(' ').map(element => {
            return element.charAt(0).toUpperCase() + element.slice(1);
          }).join(' ');
    
          if(!data.giro){
            const calle_f = data.calle_f.toLowerCase().split(' ').map(element => {
              return element.charAt(0).toUpperCase() + element.slice(1);
            }).join(' ');
    
            return `Dirígete al ${data.sentido} por ${calle_i} en dirección a ${calle_f}`
          }
          if(routeInfo[data.id-1] && routeInfo[data.id+1]){
    
            if(routeInfo[data.id-1].sentido !== routeInfo[data.id+1].sentido){
              const s = determinarGiro(routeInfo[data.id-1].sentido.toLowerCase(), routeInfo[data.id+1].sentido.toLowerCase())
              return `Gira hacia la ${s} en ${calle_i}`
            }else{
              
              return `Continúa por ${calle_i}`
            }
          }
    }

    // Define el estilo para el documento
    const styles = StyleSheet.create({
        page: {
            padding: 10,
            marginRight: 50,
            marginLeft: 50
        },
        container: {
            flexDirection: 'row', // Establece la dirección de los elementos en fila (horizontal)
            marginBottom: 10, // Espacio entre filas
        },
        timeColumn: {
            width: '30%', // Ancho de la columna de la hora
            paddingRight: 10, // Espacio a la derecha del texto en la columna de la hora
            alignItems: 'center'
        },
        instructionColumn: {
            width: '70%', // Ancho de la columna de la instrucción
        },
        text: {
            margin: 5,
            fontSize: 12
        },
    });
  
    return(
        <Document>
            <Page>
                { horaPost && routeInfo && routeInfo.map( (item,index) => {
                    return(
                        <View key={index} style={styles.container}>
                            <View style={styles.timeColumn}>
                                <Text style={styles.text}>{`${segundosAFormatoHora(horaPost[index].inicio)} -${segundosAFormatoHora(horaPost[index].fin)}`}</Text>
                            </View>
                            <View style={styles.instructionColumn}>
                                <Text style={styles.text}>
                                    {writeInstruct(item)}
                                </Text>
                            </View>
                        </View>
                    )
                })
                }
            </Page>
        </Document>
    )
}