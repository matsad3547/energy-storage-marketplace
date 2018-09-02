import React from 'react'
import PropTypes from 'prop-types'

import format from 'date-fns/format'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

import { millisToTzDate } from '../utils/'

import { monthDayTimeFormat } from '../config/'


const LineChartLmp = ({data, tz}) => {

  const formatXDate = millis => format(millisToTzDate(millis, tz), monthDayTimeFormat)

  return (

    <LineChart
      width={800}
      height={450}
      data={data}
      margin={{top: 0, right: 0, left: 0, bottom: 0}}>
      <XAxis
        dataKey="timestamp"
        tickFormatter={formatXDate}
        />
      <YAxis/>
      <CartesianGrid strokeDasharray="3 3"/>
      <Tooltip/>
      <Legend />
      <Line type="monotone" dataKey="lmp" stroke="#8884d8" activeDot={{r: 4}}/>
      <Line type="monotone" dataKey="temperature" stroke="#82ca9d" activeDot={{r: 4}}/>
    </LineChart>
  )
}

LineChartLmp.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  tz: PropTypes.string.isRequired,
}

export default LineChartLmp
