import { createContext, useState, useContext } from "react";

import {useLocalStorage} from "../../useLocalStorage"

//Data
const dataContext = createContext();
const setDataContext = createContext();

export function useDataContext(){
    return useContext(dataContext);
} 

export function useSetDataContext(){
    return useContext(setDataContext);
}

//activate menu
const activateContext = createContext();
const setActivateContext = createContext();

export function useActivateContext(){
    return useContext(activateContext);
} 

export function useSetActivateContext(){
    return useContext(setActivateContext);
}

//Alert
const alertDataContext = createContext();
const setAlertDataContext = createContext();

export function useAlertDataContext(){
    return useContext(alertDataContext);
} 

export function useSetAlertDataContext(){
    return useContext(setAlertDataContext);
}


export function DataProvider({children}){

    const [newData, setNewData] = useLocalStorage('data',null);
    const [activate, setActivate] = useState([false, false, false, false])
    const [alertData, setAlertData] = useState(null)


    return(
        <dataContext.Provider value={newData}>
        <setDataContext.Provider value={setNewData}>
        <activateContext.Provider value={activate}>
        <setActivateContext.Provider value={setActivate}>
        <alertDataContext.Provider  value={alertData}>
        <setAlertDataContext.Provider value={setAlertData}>
            {children}
        </setAlertDataContext.Provider>
        </alertDataContext.Provider>
        </setActivateContext.Provider>
        </activateContext.Provider>
        </setDataContext.Provider>
        </dataContext.Provider>

    );
}