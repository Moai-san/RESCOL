import { useEffect } from "react";
import "../styles/erroCard.scss"
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

const ErrorCardItem = ({sc, usc}) => {


    const findMissingIds = () => {
        // Convertimos array2 a un Set para una búsqueda más rápida
        const set2 = new Set(usc);

        // Encontramos los elementos que están en array1 pero no en array2
        const missingIds = sc.filter(id => !set2.has(id));

        // Convertimos el array a una cadena con los IDs separados por comas
        const idsString = missingIds.join(' y ');

        // Formateamos el mensaje
        return idsString;
    }

    return (
            <div className="error-card-container">
                <ReportProblemIcon/>
                <span>
                    {`Parece que faltan planificaciones individuales para evaluar la colaboración.`}
                </span>
                <span>
                    {`Favor de crear un escenario para `}
                    <span style={{fontWeight:'bold'}}>{findMissingIds()}</span>
                </span>
            </div>
    )
}

export default ErrorCardItem 