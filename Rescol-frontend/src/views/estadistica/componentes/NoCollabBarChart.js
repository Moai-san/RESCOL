

import { BarChart } from '@mui/x-charts/BarChart';
import { useEffect, useState } from 'react';


const NoCollabBarChart = ({type, selctedCards, unSelctedCards, factors, cardList}) => {

    const [series, setSeries] = useState([])
    const [names, setNames] = useState([])
    const [colors, setColors] = useState([])

    const a = ['#006BD6', '#EC407A'];
    
    useEffect(()=>{
        if(factors && selctedCards && unSelctedCards && selctedCards.lenght !== 0 && unSelctedCards.lenght !== 0){
            if(type === 'save'){
                const aux = factors[0].values.map((item,index) => {return ((unSelctedCards[index].c_total -item).toFixed(0))})
                setNames(unSelctedCards.map((item) => {return `${item.comuna[0].nombre}` }))
                setColors(unSelctedCards.map((item) => {return item.color }))
                setSeries([{data: aux}])


            }else if(type==='noCo'){
                const aux = unSelctedCards.map((item) => {return ((item.c_total).toFixed(0))})
                setNames(unSelctedCards.map((item) => {return `${item.nombre}` }))
                setColors(unSelctedCards.map((item) => {return item.color }))
                setSeries([{data: aux}])
            }else{
                let A = selctedCards.map(item => {return {data: [item.c_total], label:'Colaboración', color: item.color}})
                let B = unSelctedCards.map((item) => {return { 
                                                                        data: [item.c_total], 
                                                                        stack: 'A', 
                                                                        label: `${item.comuna[0].nombre}`, 
                                                                        color: item.color
                                                                    }
                                                            }
                                                    )
                setSeries(A.concat(B))
                setNames(['Dsitribución del costo por comuna'])
            }
        }
        
    },[selctedCards, unSelctedCards, factors, cardList])

    

    return <BarChart
                grid={{ horizontal: type==='factors'? false: true }}
                barLabel={(item) => `$${Number(item.value).toLocaleString('es').replace('.',' ')}`}
                sx={{
                    [`& .MuiBarLabel-root`]: {
                    fill: 'white',
                    fontWeight: 'bold',
                    },
                }}
                series={series}
                margin={{
                    top: 50,
                    bottom: 0,
                    left:80
                }}
                yAxis={[]}
                xAxis={[{
                        scaleType: 'band',
                        data: names,
                        colorMap: type==='none'? false: true && {
                            type: 'ordinal',
                            colors: colors
                        }
                    }]}
                
            />
}

export default NoCollabBarChart

/*}else if(type === 'factors' && factors){
    console.log(factors[0])
    let col = unSelctedCards.map(item => item.color)
    let A = selctedCards.map(item => {return {data: [item.c_total], label:'Colaboración', color: item.color}})
    let B = factors[0].values.map((item, index) => {return { data: [item], 
                                                            stack: 'A', 
                                                            label: `${factors[0].labels[index]}`, 
                                                            color: col[index]}})
    setSeries(A.concat(B))
    setNames(['Dsitribución del costo por comuna'])
}*/
