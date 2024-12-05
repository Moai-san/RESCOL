import { NavLink } from "react-router-dom";
import "../styles/menu.scss"
import {menu} from "../assets/data"

import { useActivateContext } from "../../providers/DataProvider";
import { useUserContext} from "../../providers/AccountProvider";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";


const Menu = () => {  
  const user = useUserContext()

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
        setIsMobile(window.innerWidth <= 700); // Cambiar a true si el ancho de la ventana es menor o igual a 430px
      };

      // Agregar un listener de resize para actualizar el estado cuando cambie el tamaño de la ventana
      window.addEventListener('resize', handleResize);

      // Llamar a handleResize al montar el componente para establecer el estado inicial
      handleResize();

      // Limpiar el listener al desmontar el componente para evitar fugas de memoria
      return () => window.removeEventListener('resize', handleResize);
    }, []);


  const normalSize = () => {
    return menu.map((item) => {
      if(item.accessRange ==='admin' && !user.admin) return
      return(
        <div className={"item "} key={item.id}>
          <Typography className="title">{item.title}</Typography>
          {item.listItems.map((listItem) => (
            <NavLink to={{pathname:listItem.url}} 
                  className={({isActive}) => isActive? 'listItemTitle activate':'listItemTitle'}
                  key={listItem.id}
                >
                {listItem.icon}
                <Typography className="listItemText">{listItem.title}</Typography>
            </NavLink>
          ))}
        </div>
      )})
  }

  const mobileSize = () => {
    var listItems = []
    for(var i=0; i<menu.length; i++){
      listItems = listItems.concat(menu[i].listItems)
    }
    return listItems.map((item) => {
      if(item.accessRange ==='admin' && !user.admin) return
      return(
        <div className="mobile-menu">
            <NavLink to={{pathname:item.url}} 
            className={({isActive}) => isActive?'listItemTitle activate':'listItemTitle'}
            key={item.id}
          >
          {item.icon}
          <Typography className="listItemText">{item.title}</Typography>
          </NavLink>
        </div> 
      )
    })
  }
  

  return (
        <div className="menu">
            {isMobile?mobileSize():normalSize()}
        </div>
      );
    };
  
  export default Menu;
