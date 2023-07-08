import React, { useEffect, useState, useContext } from 'react'
import server from '../../../server'
import { AuthenticationContext } from '../../../Auth/authentication.context'
import {
  Chart,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  registerables,
} from 'chart.js'
import 'chartjs-plugin-datalabels'
import { Line } from 'react-chartjs-2'
const LineChart = () => {
  const { setIsLoading } = useContext(AuthenticationContext)
  const [chartData, setChartData] = useState({})
  function getMonthName(dateString) {
    const date = new Date(dateString)
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    const monthIndex = date.getMonth()
    return monthNames[monthIndex]
  }
  useEffect(() => {
    const token = localStorage.getItem('accessToken')

    server
      .get(`/dashboard/six-month-report`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log('response', response)

        setIsLoading(false)

        setChartData(response.data)
      })
      .catch((e) => {
        if (e.response.status === 401) {
          // console.log('catched error')
        }
        setIsLoading(false)
      })
  }, [])

  let firstMonth = {
    startDate: getMonthName(chartData?.firstMonth?.range?.slice(0, 10)),
    totalOrdersAmount: chartData?.firstMonth?.data[0]?.totalOrdersAmount,
    totalPaAmount: chartData?.firstMonth?.data[0]?.totalPaAmount,
  }
  let secondMonth = {
    startDate: getMonthName(chartData?.secondMonth?.range?.slice(0, 10)),
    totalOrdersAmount: chartData?.secondMonth?.data[0]?.totalOrdersAmount,
    totalPaAmount: chartData?.secondMonth?.data[0]?.totalPaAmount,
  }
  let thirdMonth = {
    startDate: getMonthName(chartData?.thirdMonth?.range?.slice(0, 10)),
    totalOrdersAmount: chartData?.thirdMonth?.data[0]?.totalOrdersAmount,
    totalPaAmount: chartData?.thirdMonth?.data[0]?.totalPaAmount,
  }
  let forceMonth = {
    startDate: getMonthName(chartData?.forthMonth?.range?.slice(0, 10)),
    totalOrdersAmount: chartData?.forthMonth?.data[0]?.totalOrdersAmount,
    totalPaAmount: chartData?.forthMonth?.data[0]?.totalPaAmount,
  }
  let fifthMonth = {
    startDate: getMonthName(chartData?.fifthMonth?.range?.slice(0, 10)),
    totalOrdersAmount: chartData?.fifthMonth?.data[0]?.totalOrdersAmount,
    totalPaAmount: chartData?.fifthMonth?.data[0]?.totalPaAmount,
  }
  let sixthMonth = {
    startDate: getMonthName(chartData?.sixthMonth?.range?.slice(0, 10)),
    totalOrdersAmount: chartData?.sixthMonth?.data[0]?.totalOrdersAmount,
    totalPaAmount: chartData?.sixthMonth?.data[0]?.totalPaAmount,
  }
  let Monthlabels = [
    firstMonth.startDate,
    secondMonth.startDate,
    thirdMonth.startDate,
    forceMonth.startDate,
    fifthMonth.startDate,
    sixthMonth.startDate,
  ]
  let totalOrdersAmountData = [
    firstMonth.totalOrdersAmount,
    secondMonth.totalOrdersAmount,
    thirdMonth.totalOrdersAmount,
    forceMonth.totalOrdersAmount,
    fifthMonth.totalOrdersAmount,
    sixthMonth.totalOrdersAmount,
  ]
  let totalPaAmountData = [
    firstMonth.totalPaAmount,
    secondMonth.totalPaAmount,
    thirdMonth.totalPaAmount,
    forceMonth.totalPaAmount,
    fifthMonth.totalPaAmount,
    sixthMonth.totalPaAmount,
  ]
  Chart.register(
    ArcElement,
    Tooltip,
    Legend,
    Title,
    CategoryScale,
    ...registerables
  )

  let data = {
    labels: Monthlabels.reverse(),
    datasets: [
      {
        label: 'Total Orders Amount',
        data: totalOrdersAmountData.reverse(),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        hoverOffset: 5,
      },
      {
        label: 'Total Pa Amount',
        data: totalPaAmountData.reverse(),
        fill: false,
        borderColor: 'green',
        tension: 0.1,
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
        display: false,
        text: 'Line Chart',
      },
    },
  }
  return (
    <>
      <div className='custom-chart'>
        <Line data={data} options={options} height={400} width={400} />
      </div>
    </>
  )
}

export default LineChart
