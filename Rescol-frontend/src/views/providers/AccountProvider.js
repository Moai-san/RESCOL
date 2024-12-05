import { createContext, useEffect, useContext } from "react";
import {useLocalStorage} from "../../useLocalStorage"

//login
const loginContext = createContext();
const setLoginContext = createContext();
    
export function useLoginContext(){
    return useContext(loginContext);
} 
    
export function useSetLoginContext(){
    return useContext(setLoginContext);
}

//user
const userContext = createContext();
const setUserContext = createContext();
    
export function useUserContext(){
    return useContext(userContext);
} 
    
export function useSetUserContext(){
    return useContext(setUserContext);
}

export function AccountProvider({children}){

    const [isLoged, setLog] = useLocalStorage('log',false);
    const [user, setUser] = useLocalStorage('user',null);

    useEffect(()=>{
        if(!isLoged){
            setUser(null)
        }
    },[isLoged,setUser])




    return(
        <loginContext.Provider value={isLoged}>
        <setLoginContext.Provider value={setLog}>
        <userContext.Provider value={user}>
        <setUserContext.Provider value={setUser}>
            {children}
        </setUserContext.Provider>
        </userContext.Provider>
        </setLoginContext.Provider>
        </loginContext.Provider>
    );
}