const moment = require('moment-timezone')

const {
  aggregateHistoricalWeather,
  getPriceRequest,
} = require('../processes/')

const { calculateDerivedData } = require('../utils/')

const { dayOf5Mins } = require('../config/')

const getHistoricalData = (
  lat,
  lng,
  timeZone,
  node,
  numDays,
) => {

  const now = moment().tz(timeZone)
  const endMillis = now.valueOf()
  const startMillis = now.clone()
                      .subtract(numDays, 'days')
                      .valueOf()

  const {
    req,
    params,
  } = getPriceRequest(node)

  return Promise.all([
      req(
        ...params,
        startMillis,
        endMillis,
        node.name,
      ),
      aggregateHistoricalWeather(
        startMillis,
        endMillis,
        timeZone,
        lat,
        lng,
      ),
    ]
    .map( p => p.catch(handleMultiPromiseError) )
  )
  .then( data => {

    const processedData = calculateDerivedData(data[0], 'lmp', numDays * dayOf5Mins)

    const combinedData = [processedData.timeSeries, data[1]]
      .reduce( (agg, d) => d.error ? agg : [...agg, ...d], [])
      .sort( (a, b) => a.timestamp - b.timestamp )
      .reduce( (agr, obj, i) =>
        i > 0 && obj.timestamp === agr[agr.length - 1].timestamp ?
        [
          ...agr.slice(0, agr.length - 1),
          {
            ...agr[agr.length - 1],
            ...obj,
          },
        ]:
        [
          ...agr,
          obj,
        ], [])

    return {

      timeSeries: combinedData,
      aggregate: processedData.aggregate,
    }
  })
}

const handleMultiPromiseError = err => {
  console.error(`there was an error: ${err}`)
  return { error: `there was an error: ${err}`}
}

module.exports = getHistoricalData
