//React

import { Typography } from "@mui/material"
import { useEffect, useState } from "react"
import '../styles/detalleescenario.scss'



const DetalleDeEscebario = ({data, setCardList}) => {

    const [tableData, setTableData] = useState(null)
    
    useEffect(()=>{
        if(data){
            setTableData(
                [
                    {
                        title: 'Día de recolección',
                        data: formatDia(data.frecuencia)
                    },
                    {
                        title: 'Jornada laboral',
                        data: `${data.jornada} h`
                    },
                    {
                        title: 'Capacidad vehículos',
                        data: `${data.capacidad} t`
                    },
                    {
                        title: 'Generación de residuos',
                        data: `${data.residuos}%`
                    },
                    {
                        title: 'Costo transporte',
                        data: `$ ${data.costo}`
                    },
                ]
            )
        }
    },[data])


    const deleteItem = () => {
        setCardList(null)
    }

    const formatDia = (n) => {
        if(n === 1) return 'Lunes'
        else if(n === 2) return 'Martes'
        else if(n === 3) return 'Miércoles'
        else if(n === 4) return 'Jueves'
        else if(n === 5) return 'Viernes'
        else if(n === 6) return 'Sábado'   
    }
    
    return (
        <div className={'detalle-escenario'}>
            <table>
                <thead>
                    <tr>
                        <th>
                            Detalle de escenario
                        </th>
                        <td onClick={deleteItem}>
                            <span className="edit-button"> Modificar </span>
                        </td>
                        
                    </tr>
                </thead>
                <tbody>
                    {
                        tableData && 
                            tableData.map((item,index) => {
                                return(
                                    <tr key={index}>
                                        <td>
                                            {item.title}
                                        </td>
                                        <td>
                                            {item.data}
                                        </td>
                                    </tr>
                                )
                            })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default DetalleDeEscebario