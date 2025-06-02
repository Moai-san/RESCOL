//React
import { useEffect, useState } from "react";

//MUI
import { Typography } from "@mui/material";
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

//CSS & ESTILOS 
import "../styles/worktable.scss"

//Componentes
import Leaflet from "./Mapa"
import CropLoading from "./LoadingUploadCrop";
import TitleHeader from "./TitleHeader";
import DropDownMenu from "./DropDownMenu";
import RSD from "./Residuos";
import OptimizeButton from "./OptimizeButton";

//API
import { useUserContext } from "../../providers/AccountProvider";
import AlertNotification from "../../main/componentes/Alert";




function WorkTable() {

   const [alertData, setAlertData] = useState(null)
   const [lineData, setLineData] = useState(null)
   const [showLayertoolComponent, setShowComponent] = useState(false)
   const [showUploadComponent, setShowUploadComponent] = useState(false)
   const [disableButton, setDisabled] = useState(true)
   const [disableEditName, setDisableEditName] = useState(false)
   const [projectName, setProjectName] = useState('Nuevo escenario');
   const [parametres, setParametres] = useState({
                                                   residuos: 0, 
                                                   costo: 100, 
                                                   capacidad: 10, 
                                                   jornada: 8, 
                                                   frecuencia: 2
                                                })

   const user = useUserContext()


   
   useEffect(()=>{
      if(disableButton){
         setShowComponent(false)
      }
   },[disableButton])

   useEffect(()=>{
      if(!showUploadComponent){
         setShowComponent(false)
      }
   },[showUploadComponent])


   

   /*======================= Lógica del recorte =================================*/

   
   const [open, setOpen] = useState(false)

    
   /*============================================================================*/

   return (
      <>
         {alertData && <AlertNotification alertData={alertData} setAlertData={setAlertData}/>}
         {open && <CropLoading/>}
         <div className="worktable-menu">
            <Typography variant="subtitle1" fontWeight='bold'>
                  NOMBRAR ESCENARIO
               </Typography>
            <TitleHeader projectName={projectName} setProjectName={setProjectName} setDisabled={setDisableEditName}/>
           <Typography variant="subtitle1" fontWeight='bold'>
               ESCOGER RED VIAL
            </Typography>
           <DropDownMenu userRange={user.admin} lineData={lineData} setLineData={setLineData} setShowUploadComponent={setShowUploadComponent} setDisabled={setDisabled}/>
            <Divider></Divider>
            <Typography variant="subtitle1" fontWeight='bold'>
               AJUSTAR PARÁMETROS
            </Typography>
            <RSD parametres={parametres} setParametres={setParametres}/>
            <OptimizeButton openLoading={setOpen} 
                            disableButton={disableButton} 
                            disableEditName={disableEditName}
                            lineData={lineData} 
                            parametres={parametres} 
                            projectName={projectName} 
                            setAlertData={setAlertData}
            />
         </div>
         <Leaflet  lineData={lineData}/>
      </>
   );
}

export default WorkTable