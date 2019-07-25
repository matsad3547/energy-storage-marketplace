const moment = require('moment-timezone')

const {
  getPriceRequest,
  launchPriceUpdates,
} = require('../processes/')

const {
  updateTableRow,
  createTableRows,
  deleteTableRowsWhereNot,
} = require('../db/')

const { calculateDerivedData } = require('../utils/')

const { dayOf5Mins } = require('../config/')

const setProjectData = (node, projectId, timeZone) => {

  const numDays = 21
  const now = moment().tz(timeZone)
  const endMillis = now.valueOf() + (5 * 60 * 1000)
  const startMillis = now.clone()
                      .subtract(numDays, 'days')
                      .valueOf()

  const {
    req,
    params,
  } = getPriceRequest(node)

  return req(
    ...params,
    startMillis,
    endMillis,
    node.name,
  )
  .then( data => {
    const derivedData = calculateDerivedData(data, 'lmp', {period: numDays * dayOf5Mins})

    const {
      timeSeries,
      aggregate,
    } = derivedData

    const {
      mean,
      chargeThreshold,
      dischargeThreshold,
    } = aggregate

    console.log('mean:', mean, 'chargeThreshold:', chargeThreshold, 'dischargeThreshold:', dischargeThreshold)

    return Promise.all([
      updateTableRow(
        'node',
        {id: node.id},
        {currentAvg: mean },
      ),
      updateTableRow(
        'project',
        {id: projectId},
        {
          chargeThreshold,
          dischargeThreshold,
        },
      ),
      deleteTableRowsWhereNot(
        'price',
        {nodeId: node.id}
      ),
      createTableRows(
        'price',
        timeSeries.map( ts => ({
            ...ts,
            nodeId: node.id,
          })
        )
      ),
    ])
  })
  .then( () => launchPriceUpdates({
      node,
      timeZone,
      projectId,
    })
  )
  .catch( err => {
    console.error('There was an error getting the running average:', err)
    throw new Error(err)
  })
}

module.exports = setProjectData
