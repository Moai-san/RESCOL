import TuneIcon from '@mui/icons-material/Tune';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import HandshakeIcon from '@mui/icons-material/Handshake';
import EditRoadIcon from '@mui/icons-material/EditRoad';
export const menu = [
    {
        id: 1,
        title: "Administrador",
        accessRange: "admin",
        listItems: [
            {
                id: 1,
                accessRange: "admin",
                title: "Usuarios",
                url: "/usuarios",
                icon: <SupervisorAccountIcon/>,
            },
            {
                id: 2,
                accessRange: "admin",
                title: "Redes",
                url: "/redes",
                icon: <EditRoadIcon/>,
            },
        ]
    },
    {
        id: 3,
        title: "Principal",
        accessRange: "all",
        listItems: [
            {
                id: 4,
                accessRange: "all",
                title: "Optimizador",
                url: "principal",
                icon: <TuneIcon/>,
            },
            {
                id: 5,
                accessRange: "all",
                title: "Planificación",
                url: "planificaciones",
                icon: <MapOutlinedIcon/>,
            },
            {
                id: 6,
                accessRange: "all",
                title: "Comparador",
                url: "estadística",
                icon: <QueryStatsOutlinedIcon/>,
            },{
                id: 7,
                accessRange: "all",
                title: "Colaboración",
                url: "colaboración",
                icon: <HandshakeIcon/>,
            }
        ],
    },    
]
