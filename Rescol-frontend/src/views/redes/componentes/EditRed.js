//React
import {  useState, useRef, useEffect } from "react";
import uuid from "react-uuid";

//Material 
import { Button} from "@mui/material";
import {ScaleLoader} from "react-spinners"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RowRadioButtonsGroup from "./RadioGroup";
import ListarComunas from "./ListarComunas";
import {Typography} from "@mui/material";


//MUI: componentes
import AlertNotification from '../../main/componentes/Alert';

//CSS
import "../styles/fileupload.scss"

//API
import { updateRed } from "../../../services/redesViales";





function EditRed({editItem, setDisplayEdit, setRedData}) {
     //Valores varios
     const [load, setLoad] = useState(false);
     const [linesDisabled, setLineDisabled] = useState(true);
     const [ready, setReady] = useState(false);
    
     //Valores archivo
     const fileInputRef = useRef(null);
     const [file, setFile] = useState(null);
     const [fileName, setFileName] = useState("No hay archivo seleccionado")
 
 
     //Valores de la notificación de alerta
     const [alertData, setAlertData] = useState(null);


    useEffect(()=>{
        if(file){
            setLineDisabled(false)
        }else{
            setLineDisabled(true)
        }
        

    },[file])

    //Cargar archivo
    const loadFile = (e) => {
        if(e.target.files[0]){
            setFile(e.target.files[0]);
            setFileName(e.target.files[0].name)
            return;
        }
        setFile(null)
        setFileName("No hay archivo seleccionado"); 
    }


    const editRed = async (f)=>{
        try{
            const res = await updateRed(editItem.id, f).then(response => response.data)
            setRedData({id: `u${editItem.id}`,  data: res.geojson})
            setAlertData({title:'ÉXITO', text:'Datos editados exitosamente', type:"success"})
        } catch (err) {
            //manejo de errores
        }
    }
    
    //Subir archivo a la BD
    //Leer archivo y guardar geojson
    const inputUpload = async (e) => {
        
        setLoad(true)
        setReady(false)
        
        const f = new FormData();
        f.append('files', file);
        f.append('id', editItem.id)
        
        try{
            editRed(f)
        }  
        catch(err){
            if(file=== null){
                setAlertData({title:'Error', text:'No se ha cargado ningún archivo', type:"error"})
            }else if(err.code === 'ERR_NETWORK'){
                    setAlertData({title:'Error', text:'Error de conexión', type:"error"})
            }else{
                setAlertData({title:'Error', text:err.response.data.err, type:"error"})
            }
        }
        
        setLoad(false)
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
        setReady(true)
        setDisplayEdit(0)
    };

    const collapse = (e) => setReady(e)
    
    return(
        <div className="modal-card">
            
            <Typography variant="body1">
                Subir archivo .zip que contenga los datos con la red vial editada.
            </Typography>
            <Button className="input-area" component="label"  variant="contained" onChange={loadFile}>
                <div className='input-file'>
                    <CloudUploadIcon/>
                    <span>Subir archivo</span>
                    <div className="filename">{fileName}</div>
                </div>
                <input type="file" ref={fileInputRef} hidden/>
            </Button>
            <div className="fileupload-button-area">
                <Button sx={{width:'100%'}} variant="contained" onClick={inputUpload} disabled={linesDisabled}>
                    {load? <ScaleLoader height='20px' color='#001c41'/>:<span>Editar</span>}
                </Button>
            </div>        
            {ready? <AlertNotification alertData={alertData} collapse={collapse}/>:null}
            </div>
  )
}

export default EditRed;