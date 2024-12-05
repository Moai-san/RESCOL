// Utilidad React
import { useEffect, useState } from 'react'


//CSS
import "../styles/filtros.scss"

//MUI
import { Typography, Tooltip, IconButton} from '@mui/material';


import { week} from '../data/data'

//COMPONENTES 
import FiltersDropDown from './filtersDropdown';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

function ModelFiltros({dataComuna, setFilterData, filterList, pushFilter}) {


  const [cosValue, setCosValue] = useState({comparator:'=', value:0})
  const [resValue, setResValue] = useState({comparator:'=', value:0})
  const [capValue, setCapValue] = useState({comparator:6, value:0})
  const [jorValue, setJorValue] = useState({comparator:8, value:0})


  useEffect(() => {

    var filereData = []
    let auxData;
    if(filterList.length !== 0){
      auxData = filterList.filter(item => item.type === 'frecuencia')
      if(filereData.length ==0) filereData = dataComuna

      if(auxData.length !== 0){
        
        filereData = filereData.filter(item => {

          var frecFilter = false; // Inicializamos como false
      
          for (var i = 0; i < filterList.length; i++) {
            const filter = filterList[i];
            
            if (item.frecuencia === filter.value) {
              frecFilter = true; // Cambiamos a true si hay coincidencia
              break
            }
          }
          return frecFilter
        })
      }
      setFilterData(filereData)

    auxData = filterList.filter(item => item.type === 'costo')
    if(auxData.length !== 0){
      filereData = filereData.filter(item => {

        var cosFilter = true; // Inicializamos como false
    
        for (var i = 0; i < filterList.length; i++) {
          const filter = filterList[i];
          
          if (filter.comparator === '=') cosFilter = cosFilter && item.costo === filter.value
          else if (filter.comparator === '>') cosFilter = cosFilter && item.costo > filter.value
          else if (filter.comparator === '<') cosFilter = cosFilter && item.costo < filter.value
          else if (filter.comparator === '<=') cosFilter = cosFilter && item.costo <= filter.value
          else if (filter.comparator === '>=') cosFilter = cosFilter && item.costo >= filter.value
        }
        return cosFilter
      })

      setFilterData(filereData)
    }

    auxData = filterList.filter(item => item.type === 'residuos')
    if(auxData.length !== 0){
      filereData = filereData.filter(item => {

        var resFilter = true; // Inicializamos como false
    
        for (var i = 0; i < filterList.length; i++) {
          const filter = filterList[i];
          
          if (filter.comparator === '=') resFilter = resFilter && item.residuos === filter.value
          else if (filter.comparator === '>') resFilter = resFilter && item.residuos > filter.value
          else if (filter.comparator === '<') resFilter = resFilter && item.residuos < filter.value
          else if (filter.comparator === '<=') resFilter = resFilter && item.residuos <= filter.value
          else if (filter.comparator === '>=') resFilter = resFilter && item.residuos >= filter.value
        }
        return resFilter
      })

      setFilterData(filereData)
    }

    auxData = filterList.filter(item => item.type === 'capacidad')
      if(auxData.length !== 0){
        filereData = filereData.filter(item => {

          var frecFilter = false; // Inicializamos como false
      
          for (var i = 0; i < filterList.length; i++) {
            const filter = filterList[i];
            
            if (item.capacidad === filter.value) {
              frecFilter = true; // Cambiamos a true si hay coincidencia
              break
            }
          }
          return frecFilter
        })
        setFilterData(filereData)
      }
      

      auxData = filterList.filter(item => item.type === 'jornada')

      if(auxData.length !== 0){
        filereData = filereData.filter(item => {

          var frecFilter = false; // Inicializamos como false
      
          for (var i = 0; i < filterList.length; i++) {
            const filter = filterList[i];
            
            if (item.jornada === filter.value) {
              frecFilter = true; // Cambiamos a true si hay coincidencia
              break
            }
          }
          return frecFilter
        })

        setFilterData(filereData)
      }
    }
  }, [filterList])



  /*useEffect(()=>{
    console.log(cosValue)
  }
  ,[cosValue])*/

  const filterWeek = (id, title, value) => {

    if(filterList.filter(item => item.id === id).length === 0){
      const filterObj = {id: id, type:'frecuencia', title: title, value: value}
      pushFilter([...filterList, filterObj])
    }
  }

  const filterCos = () => {

    const id = `${cosValue.comparator}${cosValue.value}`
    if(filterList.filter(item => item.id === id).length === 0){
      const filterObj = {id: id, type:'costo', title:`Costo ${cosValue.comparator} $${cosValue.value}`, value: cosValue.value, comparator: cosValue.comparator}
      pushFilter([...filterList, filterObj])
    }
  }

  const filterRes = () => {
    console.log(resValue)
    const id = `${resValue.comparator}${resValue.value}`
    if(filterList.filter(item => item.id === id).length === 0){
      const filterObj = {id: id, type:'residuos', title:`Residuos ${resValue.comparator} ${resValue.value}%`, value: resValue.value, comparator: resValue.comparator}
      pushFilter([...filterList, filterObj])
    }
  }

  const filterCap = () => {
    if(filterList.filter(item => item.id === capValue.comparator).length === 0){
      const filterObj = {id: capValue.comparator, type:'capacidad', title:`${capValue.comparator} Toneladas`, value: capValue.comparator}
      pushFilter([...filterList, filterObj])
    }
  }

  const filterJor = () => {
    if(filterList.filter(item => item.id === jorValue.comparator).length === 0){
      const filterObj = {id: jorValue.comparator, type:'jornada', title:`${jorValue.comparator} Horas`, value: jorValue.comparator}
      pushFilter([...filterList, filterObj])
    }
  }

  return <div className='filtros-container'>
          <Typography fontWeight={'bold'} sx={{ padding:'5px 10px 10px 0px'}}>APLICAR FILTROS </Typography>
          <div className='filtros-items'>
            <Typography >Filtrar por día de recolección:</Typography>
              <div className='filtros-week-area'>
                {
                  week.map(item =>{
                      return( <Tooltip key={item.id} title={item.title}>
                                <div className={`filtros-week`} key={item.id} onClick={()=>filterWeek(item.id, item.title, item.value)}> 
                                  <Typography>{item.title[0]}</Typography>
                                </div>
                              </Tooltip>)
                    })
                }
              </div>
            </div>

            <div className='filtros-items'>
              <Typography >Filtrar por costo de transporte:</Typography>
              <table>
                <tbody>
                  <tr>
                    <tbody>
                      <td>
                        <FiltersDropDown type1={'comparator'} type2={'inputText'} setValues={setCosValue}/>
                      </td>
                      <td><IconButton onClick={filterCos}><AddCircleOutlineIcon fontSize='small'/></IconButton></td>
                    </tbody>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className='filtros-items'>
              <Typography >Filtrar por generacion de residuos:</Typography>
              <table>
                <tbody>
                  <tr>
                    <tbody>
                      <td>
                        <FiltersDropDown type1={'comparator'} type2={'residuos'} setValues={setResValue}/>
                      </td>
                      <td><IconButton onClick={filterRes}><AddCircleOutlineIcon fontSize='small'/></IconButton></td>
                    </tbody>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className='filtros-items'>
              <Typography >Filtrar por capacidad de camión:</Typography>
              <table>
                <tbody>
                  <tr>
                    <tbody>
                      <td>
                        <FiltersDropDown type1={'capacidad'} type2={''} setValues={setCapValue}/>
                      </td>
                      <td><IconButton onClick={filterCap}><AddCircleOutlineIcon fontSize='small'/></IconButton></td>
                    </tbody>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className='filtros-items'>
              <Typography >Filtrar por jornada laboral:</Typography>
              <table>
                <tbody>
                  <tr>
                    <tbody>
                      <td>
                        <FiltersDropDown type1={'jornada'} type2={''} setValues={setJorValue}/>
                      </td>
                      <td><IconButton onClick={filterJor}><AddCircleOutlineIcon fontSize='small'/></IconButton></td>
                    </tbody>
                  </tr>
                </tbody>
              </table>
            </div>
  </div>
}


export default ModelFiltros;

