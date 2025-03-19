//RACT
import { useState } from "react"

//COMPONENTES
import Modelo from "./views/modelo/componentes/Main"
import Stats from "./views/estadistica/componentes/Stats"
import Users from "./views/Usuarios/usuarios"
import Footer from "./views/main/componentes/Footer"
import Navbar from "./views/main/componentes/Navbar"
import Menu from "./views/main/componentes/Menu"
import Colaboración from "./views/colaboración/componentes/Colabroración"
//import "./styles/global.scss"
import "./global_styles/app.scss"

import { BrowserRouter, Routes, Route, Outlet} from "react-router-dom";
import { useLoginContext, useSetLoginContext} from "./views/providers/AccountProvider"
import { useUserContext } from "./views/providers/AccountProvider"
import Login from "./views/login/componentes/Login"
import { useEffect } from "react"
import RedMain from "./views/redes/componentes/RedMain"


//PLANIFICACIONES
import Home from "./views/resultados/componentes/Resultados"
import ListarRedes from "./views/resultados/componentes/ListarRedes"
import ModelCards from "./views/resultados/componentes/ModelsCards"
import RouteCards from "./views/resultados/componentes/RoutesCards"
import DetalleDeRutas from "./views/resultados/componentes/Rutas"

function App() {
  const isLogged = useLoginContext()
  const setLog = useSetLoginContext()
  const user = useUserContext()

  
  const [alertData, setAlertData] = useState(null)

  useEffect(() => {
    if(isLogged){
      setAlertData({type: 'success', text: `¡Bienvenido a RESCOL, ${user.username}!`, title: 'EXITO'})
    }
  },[isLogged])


  const Layout = () => {
    return(
      isLogged?
        <>
          <Navbar/>
          <div className="main-container">
              <Menu/>
              <Outlet/>
          </div>
          <Footer/>
        </>
        :
        <Login setLog={setLog}/>
    );
  }


  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={isLogged?<Layout/>:<Login setLog={setLog}/>}>
            <Route path="/principal" element={<Modelo/>}/>
            <Route path="/planificaciones" element={<Home/>}>
              <Route index element={<ListarRedes/>} />
              <Route path="/planificaciones/:id" element={<ModelCards/>} />
              <Route path="/planificaciones/:id/:es" element={<RouteCards />} />
              <Route path=":id/:es/:ruta" element={<DetalleDeRutas />} />
            </Route>
            <Route path="/estadística" element={<Stats/>}/>
            <Route path="/colaboración" element={<Colaboración/>}/>
            <Route path="/usuarios" element={<Users/>}/>
            <Route path="/redes" element={<RedMain/>}/>
            <Route path="*" element={<div>404 Not Found</div>}/>
          </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;


// {user && alertData && <AlertNotification alertData={alertData}/>}