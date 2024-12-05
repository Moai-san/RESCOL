import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import RemoveIcon from '@mui/icons-material/Remove';
import { Icon } from '@mui/material';
import { useEffect } from 'react';

const NoCollabTable = ({cardList, setCardList, selctedCards, unSelctedCards}) => {

    const clickRow = (item) => {
        if(cardList){
            const aux_list = cardList.map((i) => {
                if(i.id === item.id){
                    return {...i, selected: true}
                }else{
                    return {...i, selected: false}
                }
            })
            setCardList(aux_list)
        }
    }

    useEffect(()=>{
        console.log(selctedCards)
    },[])

    function segundosAFormatoHora(s) {
        var date = new Date(s * 1000); // Multiplicar por 1000 para convertir segundos a milisegundos
        var horas = date.getUTCHours();
        var minutos = date.getUTCMinutes();
        var segundos = date.getUTCSeconds();
    
        return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    }

    return (
        <table className="no-collab-table">
            <thead>
                <tr>
                    <th>Planificación</th>
                    <th>Jornada Laboral</th>
                    <th>Generación de residuos</th>
                    <th>Cantidad de Rutas</th>
                    <th>Capacidad</th>
                    <th>Kilómetros recorridos</th>
                    <th>Tiempo total del recorrido</th>
                </tr>

                    {selctedCards.map( item => {
                        return(
                            <tr key={item.id} style={{ color: item.color}}>
                                <td ><div className='table-body-item'>{item.nombre}</div></td>
                                <td ><div className='table-body-item'>{item.jornada} h</div></td>
                                <td><div className='table-body-item'>{item.residuos}%</div></td>
                                <td><div className='table-body-item'>{item.c_rutas} </div></td>
                                <td><div className='table-body-item'>{item.capacidad} t</div></td>
                                <td><div className='table-body-item'>{item.c_km.toLocaleString('es').replace('.',' ')} km </div></td>
                                <td><div className='table-body-item'>{segundosAFormatoHora(item.tiempo).toLocaleString('es').replace('.',' ')}</div> </td>
                            </tr>
                            )
                        }
                    )}   
            </thead>
            <tbody>
            <tr className='spacer'></tr>
                {unSelctedCards.map((item,index) => {
                    let ct_value;
                    let cc_value;
                    let ck_value;
                    let j_value;
                    let r_value;
                    let c_value;
                    if(selctedCards[0].tiempo > item.tiempo){
                        ct_value = <Icon sx={{ color: '#0C63E7' }}> <ArrowDropDownIcon/></Icon>
                    }else if(selctedCards[0].tiempo < item.tiempo){
                        ct_value = <Icon sx={{ color: '#FF0000' }}><ArrowDropUpIcon/> </Icon>
                    }else{
                        ct_value = <Icon sx={{ color: '#C5C6C7' }}><RemoveIcon/> </Icon>
                    }
                    
                    if(selctedCards[0].c_rutas > item.c_rutas){
                        cc_value = <Icon sx={{ color: '#0C63E7' }}> <ArrowDropDownIcon/></Icon>
                    }else if(selctedCards[0].c_rutas < item.c_rutas){
                        cc_value = <Icon sx={{ color: '#FF0000' }}><ArrowDropUpIcon/> </Icon>
                    }else{
                        cc_value = <Icon sx={{ color: '#C5C6C7' }}><RemoveIcon/> </Icon>
                    }

                    if(selctedCards[0].c_km > item.c_km){
                        ck_value = <Icon sx={{ color: '#0C63E7' }}> <ArrowDropDownIcon/></Icon>
                    }else if(selctedCards[0].c_km < item.c_km){
                        ck_value = <Icon sx={{ color: '#FF0000' }}><ArrowDropUpIcon/> </Icon>
                    }else{
                        ck_value = <Icon sx={{ color: '#C5C6C7' }}><RemoveIcon/> </Icon>
                    }

                    if(selctedCards[0].jornada > item.jornada){
                        j_value = <Icon sx={{ color: '#0C63E7' }}> <ArrowDropDownIcon/></Icon>
                    }else if(selctedCards[0].jornada < item.jornada){
                        j_value = <Icon sx={{ color: '#FF0000' }}><ArrowDropUpIcon/> </Icon>
                    }else{
                        j_value = <Icon sx={{ color: '#C5C6C7' }}><RemoveIcon/> </Icon>
                    }

                    if(selctedCards[0].residuos > item.residuos){
                        r_value = <Icon sx={{ color: '#0C63E7' }}> <ArrowDropDownIcon/></Icon>
                    }else if(selctedCards[0].residuos < item.residuos){
                        r_value = <Icon sx={{ color: '#FF0000' }}><ArrowDropUpIcon/> </Icon>
                    }else{
                        r_value = <Icon sx={{ color: '#C5C6C7' }}><RemoveIcon/> </Icon>
                    }

                    if(selctedCards[0].capacidad > item.capacidad){
                        c_value = <Icon sx={{ color: '#0C63E7' }}> <ArrowDropDownIcon/></Icon>
                    }else if(selctedCards[0].capacidad < item.capacidad){
                        c_value = <Icon sx={{ color: '#FF0000' }}><ArrowDropUpIcon/> </Icon>
                    }else{
                        c_value = <Icon sx={{ color: '#C5C6C7' }}><RemoveIcon/> </Icon>
                    }


                    return(
                        <>
                            <tr key={item.id} style={{ color: item.color, cursor:'pointer'}} onClick={()=>{clickRow(item)}}>
                                <td ><div className='table-body-item'>{item.nombre}</div></td>
                                <td ><div className='table-body-item'>{item.jornada} h {j_value}</div></td>
                                <td><div className='table-body-item'>{item.residuos}% { r_value}</div></td>
                                <td><div className='table-body-item'>{item.c_rutas} {cc_value}</div></td>
                                <td><div className='table-body-item'>{item.capacidad} t {c_value}</div></td>
                                <td><div className='table-body-item'>{item.c_km.toLocaleString('es').replaceAll('.',' ')} km { ck_value}</div></td>
                                <td><div className='table-body-item'>{segundosAFormatoHora(item.tiempo).toLocaleString('es').replace('.',' ')} { ct_value}</div> </td>
                            </tr>
                            <tr className='spacer'></tr>
                        </>
                    )
                })}
            </tbody>
        </table>
    )
}

export default NoCollabTable 