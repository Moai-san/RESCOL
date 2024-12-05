//React

//MUI

//CSS & ESTILOS 
import '../styles/listarcomunas.scss'


//Componentes
import { useEffect, useState } from "react"
import { getComunas } from "../../../services/comunas"


const ListarComunas = ({comunasList, setComunasList}) => {

    const [comunas, setComunas] = useState([])
    
    useEffect(()=>{
        const fetchComunas = async () => {
            try{
                const res = await getComunas()
                setComunas(res.data)
            } catch (err) {
                //manejo de errores
            }
        }
        fetchComunas()
    },[])

    
    const onCheck = (e) => {
        const id = e.target.id
        if(comunasList.includes(id)){
            setComunasList(comunasList.filter(item => item !== id))
        }else{
            setComunasList([...comunasList, id])
        }
    }

    return (
        <div>
            {comunas && comunas.map(item => {
                return <div key={item.id} className='list-content'> <label>
                            <input id={item.id} type="checkbox" class="input" onChange={onCheck}/>
                            <span class="custom-checkbox"></span>
                            </label>{item.nombre}
                        </div>
            })}
        </div>
    )
}

export default ListarComunas