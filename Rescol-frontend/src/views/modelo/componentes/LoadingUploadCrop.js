//React

//MUI

//CSS & ESTILOS 
import "../styles/loadingUploadCrop.scss"

//COMPONENTES
import camion from '../assets/camion.png'
//API

//Contextos
import { Typography } from "@mui/material";


function CropLoading() {    

    return (
        <div className="upload-crop-background">
            <Typography variant="h6">Generando Planificación...</Typography>
            <img src={camion} width="200"/>
            <div className="loader"></div>
        </div>
    );
}

export default CropLoading
