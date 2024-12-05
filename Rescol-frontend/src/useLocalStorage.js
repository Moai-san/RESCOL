import {useState} from 'react'
import { dataEncrypt } from './utils/data-encrypt';
import { dataDecrypt } from './utils/data-decrypt';

export function useLocalStorage (key, initialValue){

    const [storedValue, setStoredValue] = useState(() => {
        try{
            const item = dataDecrypt(window.localStorage.getItem(key))
            return item? item : initialValue
        }catch{
            return initialValue
        }
    });

    const setValue = value => {
        try{
            setStoredValue(value)
            window.localStorage.setItem(key,dataEncrypt(value))
        }catch(error){
            console.log('error')

        }
    };

    return [storedValue, setValue]
}
