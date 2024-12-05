
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart"
import { useEffect, useState } from "react";
import { Box } from "@mui/material";

const NewPieChart = ({pieData}) => {


    return(
        <Box sx={{ width: '50%'}}>
            <PieChart
                series={[
                    {
                        data: [
                            { id: 0, value:  costo_real - pieData.c_total},
                            { id: 1, value:  pieData.c_camion*66667},
                            { id: 2, value:  pieData.shifts*118750 },
                        ],
                    },
                ]}
                />
        </Box>
    )
}

export default NewPieChart