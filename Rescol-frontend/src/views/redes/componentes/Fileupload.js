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
import { ErrorManager } from "../../../services/ErrorManager";


//CSS
import "../styles/fileupload.scss"

//API
import { postRed } from "../../../services/redesViales";

function FileUpload({setRedData, clickItem, setAlertData}){
    //Valores varios
    const [load, setLoad] = useState(false);
    const [linesDisabled, setLineDisabled] = useState(true);

    const [title, setTitle] = useState('Subir archivo')
   
    //Valores archivo
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("No hay archivo seleccionado")
    const [value, setValue] = useState(false);
    const [comunasList, setComunasList] = useState([])


    //Valores capa
    const [layerName, setLayerName] = useState("")

    useEffect(()=>{
        if(!value){
            if(file && layerName !== ''){
                setLineDisabled(false)
            }else{
                setLineDisabled(true)
            }
        }else{
            if(comunasList.length !==0 && file && layerName !== ''){
                setLineDisabled(false)
            }else{
                setLineDisabled(true)
            }
        }
        

    },[file, layerName, comunasList, value])

    useEffect(()=>{
        if(value) setComunasList([])
    },[value])


    async function postGeojson(geodata,id){

        if(typeof  geodata.geojson === 'string'){
            geodata.geojson = JSON.parse(geodata.geojson)
  
        }
        setRedData({id:id,  data: geodata.geojson})
    } 

    //Cargar archivo
    const loadFile = (e) => {
        if(e.target.files[0]){
            setFile(e.target.files[0]);
            setFileName(e.target.files[0].name)
            setTitle('Archivo cargado correctamente')
            return;
        }
        setFile(null)
        setTitle('Seleccione un archivo')
        setFileName("No hay archivo seleccionado"); 
    }

    //Leer archivo y guardar geojson
    const inputUpload = async (e) => {
        
        setLoad(true)

        const id = uuid()
        
        const f = new FormData();
        f.append('files', file);
        f.append('id', id)
        f.append('name', layerName)
        f.append('colaborativo', value)
        f.append('comunas', comunasList)
        
        try{
            const res = await postRed(f).then(response => response.data)
            setAlertData({title:'ÉXITO', text:'Datos cargados exitosamente', type:"success"})
            postGeojson(res,id)

        }  
        catch(err){
            if(file=== null){
                setAlertData({title:'Error', text:'No se ha cargado ningún archivo', type:"error"})
            }else if(err.request.response){
                setAlertData({title:'Error', text: err.request.response, type:"error"})
            }else{
                console.log(err)
                setAlertData(ErrorManager(err.code))
            }
        }
        
        setLoad(false)
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
        clickItem(0)
    };

    const handleInputChange = (event) => {
        setLayerName(event.target.value);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFiles = e.dataTransfer.files;
        setFile(droppedFiles);
      };
    
      const handleDragOver = (e) => {
        e.preventDefault();
      };



    return (
        <div className="modal-card">
            <Typography variant="body1">
                Subir archivo .zip que contenga los datos con la  red vial para realizar la optimización.
            </Typography>
            <Button className="input-area" component="label"  variant="contained" onChange={loadFile}>
                <div className='input-file'>
                    <CloudUploadIcon/>
                    <span style={{fontSize:'12px', fontWeight:'bold'}}>{title}</span>
                    <div className="filename">{fileName}</div>
                </div>
                <input type="file" ref={fileInputRef} hidden/>
            </Button>

            <div className={`file-input-container ${file && layerName === '' && 'file-input-container-activate'}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}>
                <input  className="file-input-name" 
                        placeholder="Asignar nombre a la red vial"
                        value={layerName}
                        onChange={handleInputChange}
                        />
            </div>
            <RowRadioButtonsGroup value={value} setValue={setValue}/>
            {value && <ListarComunas comunasList={comunasList} setComunasList={setComunasList}/>}
            <div className="fileupload-button-area">
                <Button sx={{width:'100%'}} variant="contained" onClick={inputUpload} disabled={linesDisabled}>
                    {load? <ScaleLoader height='20px' color='#001c41'/>:<span>Guardar</span>}
                </Button>
            </div>        
            </div>
    );
}

export default FileUpload