//React
import { useEffect } from 'react';

//MUI
import { IconButton, Tooltip } from '@mui/material';

//CSS & ESTILOS 
import '../../modelo/styles/dropdownmenu.scss'
import FilterAltOffSharpIcon from '@mui/icons-material/FilterAltOffSharp';
import FilterAltSharpIcon from '@mui/icons-material/FilterAltSharp';
import ClearSharpIcon from '@mui/icons-material/ClearSharp';

//Componentes


import "../styles/filtros.scss"

const NameFilter = ({title, filters, setFilters, activate, setActivate}) => {

    useEffect(()=>{
        if(title.length !== 2){
            setFilters([])
        }
    },[title])
    

    const activateFilter = () => {
        setActivate(!activate)
    }

    const deleteFilter = (id) => {
        setFilters(filters.filter(item => item.id !== id))
    }


    return (
        <div className="filter">
            <div className={`filter-deactivate`}>
                <span>{title.at(-1)}</span>
                {title.length === 2 && <Tooltip title='Activar Filtros'><IconButton onClick={activateFilter}>{activate?<FilterAltSharpIcon fontSize='small'/>:<FilterAltOffSharpIcon/>}</IconButton></Tooltip>}
            </div>
            {title.length === 2 && activate && filters.length !== 0 && <div className='filter-tag-area'>
                { filters.map(item => { 
                        return <div className='filtros-tags' key={item.id}>
                                    <IconButton style={{ fontSize: '14px', padding: '2px', color:'white'}} onClick={() => deleteFilter(item.id)}>
                                    <   ClearSharpIcon style={{ fontSize: '12px' }} />
                                    </IconButton>
                                    <span style={{ fontSize: '12px', lineHeight: '15px', verticalAlign: 'middle', marginRight: '10px' }}>{item.title}</span>
                                </div>
                    })
                }
            </div>}
            
        </div>
    )
}

export default NameFilter
