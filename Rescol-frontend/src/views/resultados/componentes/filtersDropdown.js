//React
import { useState, useEffect, useRef } from 'react';

//MUI
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { comparators, residuos , capacidad, jornada} from '../data/data';

import InputAdornment from '@mui/material/InputAdornment';

//CSS & ESTILOS 

//Componentes

const FiltersDropDown = ({type1, type2, setValues}) => {


    const [titleHeader, setTitleHeader] = useState('')
    const [titleHeader2, setTitleHeader2] = useState('')

    const [activate, setActivate] = useState(false)

    const [activate2, setActivate2] = useState(false)

    const dropdownRef = useRef(null);
    const dropdownRef2 = useRef(null);

    const [filterList, setFilterlist] = useState(null)
    const [filterList2, setFilterlist2] = useState(null)

    const [comparator, setComparator] = useState('=')
    const [num, setNum] = useState(0)
    const [resValue, setResValue] = useState(0)

    useEffect(()=>{
        if(type1 === 'comparator'){
          setTitleHeader(comparators.filter(item => item.id === 'comparator-3')[0].title)
          setFilterlist(comparators)
        }else if(type1 === 'capacidad'){
          setTitleHeader(capacidad.filter(item => item.id === 'capacidad-1')[0].title)
          setFilterlist(capacidad)
          setComparator(capacidad.filter(item => item.id === 'capacidad-1')[0].value)
        }else if(type1 === 'jornada'){
          setTitleHeader(jornada.filter(item => item.id === 'jornada-1')[0].title)
          setFilterlist(jornada)
          setComparator(jornada.filter(item => item.id === 'jornada-1')[0].value)
        }
        
        if(type2 === 'residuos'){
          setTitleHeader2(residuos.filter(item => item.id === 'residuos-4')[0].title)
          setFilterlist2(residuos)
        }
    },[type1, type2])

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setActivate(false);
          }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [dropdownRef]);

      useEffect(() => {
        const handleClickOutside = (event) => {
          if (dropdownRef2.current && !dropdownRef2.current.contains(event.target)) {
            setActivate2(false);
          }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [dropdownRef2]);


    const activateDropMenu = () => {
        setActivate(!activate)
    }

    const activateDropMenu2 = () => {
      setActivate2(!activate2)
  }


    useEffect(()=>{
      if(type1 === 'comparator' && type2=== 'inputText') setValues({comparator:comparator, value:num})
      else if(type1 === 'comparator' && type2=== 'residuos') setValues({comparator:comparator, value:resValue})
      else setValues({comparator:comparator, value:resValue})
    },[num, comparator, resValue, setValues, type1, type2])

    const getValue = (item) => {
      setTitleHeader(item.title)
      setComparator(item.value)
      setActivate(!activate)
    }

    const getValue2 = (item) => {
      setTitleHeader2(item.title)
      setResValue(item.value)
      setActivate2(!activate2)
    }

    const HandleChangeInput = (e) => {
      const newValue = e.target.value;
      if(newValue === '') {
          setNum(0);
      } else {
          const costo = parseInt(newValue)
          if(costo <= 2000) setNum(costo)
          else setNum(2000);
      }
    }

    return (
      <div style={{display:'flex', gap:'10px'}}>
          <div className="dropdown" ref={dropdownRef} style={{width:`${type2===''?'100%':'60%'}`}}>
              <div className={`dropdown-title-content ${activate? 'dropdown-activate': ''}`} onClick={activateDropMenu}>
                  <span>{titleHeader}</span> {activate? <ArrowDropUpIcon/>:<ArrowDropDownIcon/>}
              </div>

              {activate && 
                  <div className="dropdown-content">
                      <div className="triangulo"></div>
                      <div className='dropdown-item-tittle'>
                          FILTRO
                      </div>
                      {filterList.map((item) => 
                          {
                              return(
                                  <div className='dropdown-itemlist' key={item.id}>
                                      <div className='dropdown-item' onClick={()=>getValue(item)}>
                                          {`${item.title}`}
                                      </div>
                                  </div>)
                          }
                      )}
                  
                  </div>
              }
          </div>
          {type2 === 'inputText' && <div className={`file-input-container`} style={{width:'40%'}}>
                                      <InputAdornment>$</InputAdornment>
                                      <input  className="file-input-name" 
                                              type='text'
                                              placeholder={0}
                                              value={num}
                                              onChange={HandleChangeInput}
                                      />
                                    </div>}
          {type2 === 'residuos' && <div className="dropdown" ref={dropdownRef2} style={{width:'40%'}}>
              <div className={`dropdown-title-content ${activate2? 'dropdown-activate': ''}`} onClick={activateDropMenu2}>
                  <span>{titleHeader2}</span> {activate2? <ArrowDropUpIcon/>:<ArrowDropDownIcon/>}
              </div>

              {activate2 && 
                  <div className="dropdown-content">
                      <div className="triangulo"></div>
                      <div className='dropdown-item-tittle'>
                          FILTRO
                      </div>
                      {filterList2.map((item) => 
                          {
                              return(
                                  <div className='dropdown-itemlist' key={item.id}>
                                      <div className='dropdown-item' onClick={()=>getValue2(item)}>
                                          {`${item.title}`}
                                      </div>
                                  </div>)
                          }
                      )}
                  
                  </div>
              }
          </div>}
        </div>
    )
}

export default FiltersDropDown