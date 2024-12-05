export const buttonStyle = { 
    mr: 1, 
    fontWeight:'bold', 
    backgroundColor: '#106cc4',
    //backgroundColor: '#045c50',
    color: '#fff',
    '&:hover':{
        background: "#384256",
    },
}


export const textFieldStyle = {
    "& .MuiInput-input":{
        color:'#384256',
        "&:hover":{
            color: '#045c50',
        },

        "&:focus":{
            color: '#045c50',
        },
      },
    "& .MuiInputLabel-root.Mui-focused":{
            color: '#045c50',

    },
    '& .MuiInput-underline:': { 
        "&:after":{
            borderBottomColor: '#045c50',
        },
        "&:hover":{
            borderColor: '#045c50',
        }
    }, 
    "& .MuiInput-root:hover::before":{
        borderColor: '#045c50',

},
    
}

export const stepStyle={
    "& .MuiStepLabel-label.Mui-active":{
      color:'#106cc4',
      fontWeight: 750,
    },
    "& .MuiStepIcon-root.Mui-active": { color: '#106cc4' },
    "& .MuiStepIcon-root.Mui-completed": { color: '#001c41' },
  }

  export const modalBoxStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    bgcolor: 'background.paper',
    borderRadius:'20px',
    boxShadow: 24,
  };