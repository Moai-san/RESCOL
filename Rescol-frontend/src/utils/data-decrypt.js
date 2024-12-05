import CryptoJS from "crypto-js";

export const dataDecrypt = (value) =>{
    const bytes = CryptoJS.AES.decrypt(value, process.env.REACT_APP_SECURITY_KEY)
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8)); 
}