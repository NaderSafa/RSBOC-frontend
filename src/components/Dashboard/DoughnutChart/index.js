import React from 'react'
import { Chart, ArcElement, Title, Tooltip, Legend } from 'chart.js'
import 'chartjs-plugin-datalabels'
import { Doughnut } from 'react-chartjs-2'
import './index.scss'

const DoughnutChart = () => {
  Chart.register(ArcElement, Tooltip, Legend, Title)
  let data = {
    labels: ['Red', 'cian', 'ellow'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [100, 50, 100],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
        ],
        hoverOffset: 5,
      },
    ],
  }

  let options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Doughnut Chart',
      },
    },
  }
  return (
    <div className='custom-chart'>
      <Doughnut data={data} options={options} height={400} width={400} />
    </div>
  )
}

export default DoughnutChart
