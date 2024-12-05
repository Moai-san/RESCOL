import { useEffect } from 'react'
import '../styles/table.scss'

const Table = ({data}) => {

    return (
        <div className='collab-table-container'>
            <table>
                <thead>
                    <tr>
                        <th>Detalle</th>
                        <th>Costo ($)</th>
                    </tr>

                </thead>
                <tbody>
                    
                        {data.map((item) => {
                            return(
                                <tr key={item.id}>
                                    <th key={item.id}>{item.text}</th>
                                    <td key={item.value}>{item.value}</td>
                                </tr>    
                            )
                        })}
                    
                </tbody>
            </table>
        </div>
    )
}

export default Table 