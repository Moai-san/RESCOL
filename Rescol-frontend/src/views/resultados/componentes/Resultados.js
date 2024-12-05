//React
import React, {useEffect} from "react";
import { Outlet} from "react-router-dom";

//COMPONENTES
import MapContainer from "./MapContainer";
import BreadcrumbsComponent from "./Breadcrums";

//MUI
import { Typography } from "@mui/material";


//CONTEXTOS


//CSS
import "../styles/resultados.scss"
import "../styles/breadcrumbs.scss"



const Home = () => {

    return (
        <>
        <div className="resultados-main-container">
            <div className="resultados-main-menu-area">
                <Typography fontWeight={'bold'}>PLANIFICACIONES</Typography>       
                <BreadcrumbsComponent/>       
                <Outlet/>
            </div>
            <div className="resultados-main-map-area">
                <MapContainer/> 
            </div>
        </div>
        </>
    )
}

export default React.memo(Home);