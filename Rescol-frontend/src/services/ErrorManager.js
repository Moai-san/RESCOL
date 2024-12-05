export const ErrorManager = (code) => {
    const title = 'ERROR'
    const type  = "error"
    console.log(code)
    if(code === "ERR_NETWORK"){
        return ({title: title, type: type, text:'No hay conexión a internet'})
    }else if ( code === 'USER_NOT_ENTERED'){
        return ({title: title, type: type, text:'Ingrese un usuario'})

    }else if ( code === 'USER_NOT_FOUND'){
        return ({title: title, type: type, text:'No se ha encontrado el usuario'})

    }else if ( code === 'PWRD_NOT_ENTERED'){
        return ({title: title, type: type, text:'Ingrese una contraseña'})

    }else if ( code === 'WRONG_PWRD'){
        return ({title: title, type: type, text:'Contraseña incorrecta'})

    }else if (code === 'MODEL_NAME_ALREADY_EXIST'){
        return ({title: title, type: type, text:'Ya existe una optimización con ese nombre'})
    }else{
        return ({title: title, type: type, text:'Ha ocurrido un error inesperado'})
    }
} 

