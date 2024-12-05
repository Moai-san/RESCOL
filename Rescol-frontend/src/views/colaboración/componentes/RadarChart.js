import React, { Component } from 'react';
import Chart from 'react-apexcharts'

class Donut extends Component {

  constructor(props) {
    super(props);


    this.state = {
      options: {
        colors: this.props.colors,
        xaxis: {
            categories: ["Per cápita","Prod. Per Cápita","Por Ahorro","Por Ingreso Por Hogar"],
            labels: {
              show: true,
              style: {
                colors: ["#a8a8a8"],
                fontSize: "11px",
                fontFamily: 'Arial',
          }}},
      },
     
      series: [
        {
          name: "Cerro Navia",
          data: this.props.factors.map(item => item.values[0].toFixed(2)*100)
        },
        {
          name: "Quinta Normal",
          data: this.props.factors.map(item => item.values[1].toFixed(2)*100)
        }
      ],
    }
  }
  

  render() {
    return (
      <div className="donut">
        <Chart options={this.state.options} series={this.state.series} type="radar" width="380" height="350"/>
      </div>
    );
  }
}

export default Donut;