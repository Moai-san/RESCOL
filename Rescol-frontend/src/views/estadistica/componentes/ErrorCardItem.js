import "../styles/erroCard.scss"
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

const ErrorCardItem = () => {

    return (
            <div className="error-card-container">
                <ReportProblemIcon/>
                <span>
                    No se han encontrado optimizaciones con la configuración entregada.
                    Favor de crearlas antes de continuar. 
                </span>
            </div>
    )
}

export default ErrorCardItem 