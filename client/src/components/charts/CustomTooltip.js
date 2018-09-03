import React from 'react'

import {
  monthDayTimeFormat,
  dataLabels,
} from '../../config/'

import { formatMillis } from '../../utils/'

const CustomTooltip = ({
  type,
  payload,
  label,
  active,
  tz,
 }) => (

  active ?
    <div style={styles.root}>
      <p style={styles.date}>
        {formatMillis(label, tz, monthDayTimeFormat)}
      </p>
      { payload.map( (obj, i) =>
        <p
          style={
            {
              color: obj.color,
              padding: 5,
            }
          }
          key={`value-${i}`}
          >
            {
              `${dataLabels[obj.name].label}:  ${dataLabels[obj.name].format(obj.value)}${dataLabels[obj.name].unit}`
            }
         </p>
      )}
    </div> : null
)

const styles = {
  root: {
    backgroundColor: '#fff',
    border: '1px solid #a8a2aa',
    borderRadius: 5,
  },
  date: {
    padding: 5,
    fontSize: '1em'
  },
}

export default CustomTooltip
