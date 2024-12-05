import CryptoJS from "crypto-js";

export const dataEncrypt = (value) =>{
     return CryptoJS.AES.encrypt(JSON.stringify(value), process.env.REACT_APP_SECURITY_KEY).toString()
}