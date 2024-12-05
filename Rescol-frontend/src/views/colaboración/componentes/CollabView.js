import "../styles/noCollab.scss"
import { useEffect, useState } from "react";

//COMPONENTES
import EmptyCardItem from "./EmptyCardItem";
import { getRed } from "../../../services/redesViales";
import { filterModel } from "../../../services/modelos";
import { useUserContext } from "../../providers/AccountProvider";
import DetalleDeEscebario from "./DetalleEscenario";
import AlertNotification from "../../main/componentes/Alert";
import { ErrorManager } from "../../../services/ErrorManager";

const CollabView = ({setModal, cardList, setCardList, setRedId}) => {

    const colorPallete = ['#46685b', '#648a64', '#a6b985','#a6b985', '#213435']

    const user = useUserContext()

    const [disabled, setDisabled] = useState(true)
    const [modelsData, setModelsData] = useState(null)
    const [redesData, setRedesData] = useState(null)
    const [alertData, setAlertData] = useState(null)

    useEffect(()=>{
        setDisabled(false)
        const fetchRedes = async() => {
            try{
                const redes = await getRed(user.id).then(response => response.data)
                setRedesData(redes)
                const filteredId = redes.filter(item => item.colaborativo === true).map(item => item.id)
                setRedId(filteredId)
            } catch (err){
                //Manejo de errores
                setAlertData(ErrorManager(err.code))
            }
        }
        fetchRedes()
    },[cardList])

    useEffect(()=>{
        if(cardList && cardList.length === 0){
        }else if(cardList && cardList.length < 2) {
            const filterModels = async (model) => {  
                try{ 
                    const res = await filterModel({...model, user: user.id}).then(res => res.data)
                    setModelsData(res.response)
                } catch (err){
                    //Manejo de errores
                }
            }
            
            filterModels(cardList[0])
        }
      
    },[cardList])

    useEffect(()=>{
        if(cardList && modelsData){

            setCardList(cardList.concat(modelsData).map((item, index) => {
                return {...item, color: colorPallete[index]}
            }))

        }
    },[modelsData])


    return (
        <div className="no-collab-container">
            {alertData && <AlertNotification alertData={alertData} setAlertData={setAlertData}/>}
            {cardList && cardList.length !== 0? 
                <DetalleDeEscebario data={cardList.find((item, index) => index === 0)} cardList={cardList} setCardList={setCardList}/>
                :
                <EmptyCardItem setModal={setModal} disabled={disabled}/>
            }
        </div>
    )
}

export default CollabView 

/*return(
                       <CardItem type='collab' showDelete={item.id === cardList[0].id} item={item} cardList={cardList} setCardList={setCardList}/>
                        
                    )
                })
<div className="tags">
                <Typography>Comunas</Typography>
                {cardList.length !== 0 ?
                cardList.map((item, index )=> {
                    return <div className='identificador'> 
                                <div style={{backgroundColor:`${item.color}`, height:'30px', width:'30px'}}></div>
                                <>{index === 0?'Colaboración':item.comuna[0].nombre}</>
                           </div>
                }):
                <Typography>Seleccione un escenario</Typography>
                }
            </div>
*/

