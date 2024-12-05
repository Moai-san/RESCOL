// Utilidad React
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useState } from "react";


//CSS
import "../styles/redmain.scss"

//MUI
import { Typography } from "@mui/material";

//COMPONENTES 
import FileUpload from "./Fileupload";
import ItemBox from "../../../reutilizables/componentes/ItemBox";
import ListarRedes from './ListarRedes';
import Leaflet from './Mapa';
import AlertNotification from '../../main/componentes/Alert';




function RedMain() {


    const [redData, setRedData] = useState(null)
    const [alertData, setAlertData] = useState(null)

    const clickItem = (id) => {
        const aux = data.map(
            (item) => {
                if(item.id === id) return({...item, display: !item.display})
                else return({...item, display: false})
            }
        )
        setData(aux)
    }

    const items = [
        {
            id:0,
            text: 'Listar redes',
            display: false,
            componente: <ListarRedes setRedData={setRedData} setAlertData={setAlertData}/>,
            className: 'red-main-itembox'
        },
        {
            id:1,
            text: 'Agregar red',
            display: false,
            componente: <FileUpload setRedData={setRedData} clickItem={clickItem} setAlertData={setAlertData}/>,
            className:'red-main-fileupload'
        },
        
    ]

    const [data, setData] = useState(items)


    
    return(
        <div className="red-main-container">
            {alertData && <AlertNotification alertData={alertData} setAlertData={setAlertData}/>}
            <div className="red-main-menu-area">
                <Typography variant="subtitle1" fontWeight='bold'>
                    REDES VIALES
               </Typography>
               {
                 data.map(item => {
                    return (
                        <div key={item.id} >
                        <ItemBox id={item.id} text={item.text} onClick={clickItem}/>
                        <TransitionGroup>
                            {item.display && <CSSTransition
                                classNames={item.className}
                                timeout={1000} // Duración de la animación en milisegundos
                                >
                                    <div key={item.id}>
                                        {item.componente}
                                    </div>
                                </CSSTransition>}
                        </TransitionGroup>
                        </div>

                    )
                })
               }
            </div>
            <div className="red-main-map-area">
                <Leaflet lineData={redData}/>
            </div>
        </div>
  )
}

export default RedMain;

/*       
<FileUpload/>
*/