const { timeSeriesData } = require('./mocks/timeSeries')

const {
  calculateMovingAverage,
  calculateScore,
  calculateArbitrage,
  pipeData,
} = require('../dataScienceUtils')

const testData = [
  //centered on 3
  {
    timestamp: 1,
    val: 3,
  },
  {
    timestamp: 2,
    val: 7,
  },
  {
    timestamp: 3,
    val: -1,
  },
  {
    timestamp: 4,
    val: 6,
  },
  {
    timestamp: 5,
    val: 0,
  },
  {
    timestamp: 6,
    val: 8,
  },
]

describe('calculateMovingAverage', () => {

  test('should return an array', () => {
    const data = timeSeriesData
    const period = 10
    const key = 'lmp'
    const expected = true
    const actual = Array.isArray(calculateMovingAverage(data, key, period))
    expect(actual).toEqual(expected)
  })

  test('should return an array 287 items long', () => {
    const data = timeSeriesData
    const period = 10
    const key = 'lmp'
    const expected = 287
    const actual = calculateMovingAverage(data, key, period).length
    expect(actual).toEqual(expected)
  })

  test('should return an object with a `timestamp` property and a `mvAvg` property and a property for whichever key was passed in', () => {
    const data = timeSeriesData
    const period = 10
    const key = 'lmp'
    const expected = new Array(287).fill(true)
    const arr = calculateMovingAverage(data, key, period)
    const keyArr = arr.map( obj => Object.keys(obj) )
    const actual = keyArr.map( k =>
      k.includes('timestamp') &&
      k.includes('mvgAvg') &&
      k.includes(key)
    )
    expect(actual).toEqual(expected)
  })

  test('should have a value for its first entry equal to the average of the first two entries of the input', () => {
    const data = timeSeriesData
    const period = 5
    const key = 'lmp'
    const expected = 27.02553
    const actual = calculateMovingAverage(data, key, period)[0].mvgAvg
    expect(actual).toEqual(expected)
  })

  test('should have a value of `26.694084` for its last entry for the last 5 entries', () => {
    const data = timeSeriesData.slice(282)
    const period = 5
    const key = 'lmp'
    const expected = 26.694084000000004
    const actual = calculateMovingAverage(data, key, period)[4].mvgAvg
    expect(actual).toEqual(expected)
  })
})

describe('calculateScore', () => {

  let period = 5
  let key = 'val'
  const getAvgData = pipeData(
    calculateMovingAverage,
  )

  let data

  beforeEach( () => {
      data = getAvgData(testData, key, period)
  })

  test('should return an array', () => {
    const expected = true
    const actual = Array.isArray(calculateScore(data, key))
    expect(actual).toEqual(expected)
  })

  test('should return an array 5 items long', () => {
    const expected = 5
    const actual = calculateScore(data, key).length
    expect(actual).toEqual(expected)
  })

  test('should return an object with `timestamp`, `mvAvg`, and `score` properties and a property for whichever key was passed in', () => {
    const expected = new Array(5).fill(true)
    const arr = calculateScore(data, key)
    const keyArr = arr.map( obj => Object.keys(obj) )
    const actual = keyArr.map( k =>
      k.includes('timestamp') &&
      k.includes('mvgAvg') &&
      k.includes('score') &&
      k.includes(key)
    )
    expect(actual).toEqual(expected)
  })

  test('should have a `mvgAvg` value of `4` for its last entry for the last 5 entries', () => {
    const expected = 4
    const actual = calculateScore(data, key)[4].mvgAvg
    expect(actual).toEqual(expected)
  })

  test('should have a `score` value of `2` for its last entry', () => {
    const expected = 1
    const actual = calculateScore(data, key)[4].score
    expect(actual).toEqual(expected)
  })

  test('should have a `score` value of `0.4` for its first entry', () => {
    const expected = .4
    const actual = calculateScore(data, key)[0].score
    expect(actual).toEqual(expected)
  })

  test('should have a `score` value of `-1` for its second to last entry', () => {
    const expected = -1
    const actual = calculateScore(data, key)[3].score
    expect(actual).toEqual(expected)
  })

  // visualization purposes only
  test('should look like an array of objects', () => {
    const expected = [
      {
        mvgAvg: 5,
        score: 0.4,
        timestamp: 2,
        val: 7,
      },
      {
        mvgAvg: 3,
        score: -1.3333333333333333,
        timestamp: 3,
        val: -1,
      },
      {
        mvgAvg: 3.75,
        score: 0.6,
        timestamp: 4,
        val: 6,
      },
      {
        mvgAvg: 3,
        score: -1,
        timestamp: 5,
        val: 0,
      },
      {
        mvgAvg: 4,
        score: 1,
        timestamp: 6,
        val: 8,
      },
    ]
    const actual = calculateScore(data, key)
    expect(actual).toEqual(expected)
  })

  // //visualization purposes only
  // test('should look like an array of objects', () => {
  //   const period = 10
  //   const key = 'lmp'
  //   const data = getAvgData(timeSeriesData, key, period)
  //   const expected = []
  //   const actual = calculateScore(data, key)
  //   expect(actual).toEqual(expected)
  // })
})

describe('calculateArbitrage', () => {

  let period = 5
  let key = 'val'
  const getScoreData = pipeData(
    calculateMovingAverage,
    calculateScore,
  )

  let data

  beforeEach( () => {
    data = getScoreData(testData, key, period)
  })

  test('should return the passed in data', () => {
    const actual = calculateArbitrage(data, key, period, .5).data
    const expected = [
      {
        mvgAvg: 5,
        score: 0.4,
        timestamp: 2,
        val: 7,
      },
      {
        mvgAvg: 3,
        score: -1.3333333333333333,
        timestamp: 3,
        val: -1,
      },
      {
        mvgAvg: 3.75,
        score: 0.6,
        timestamp: 4,
        val: 6,
      },
      {
        mvgAvg: 3,
        score: -1,
        timestamp: 5,
        val: 0,
      },
      {
        mvgAvg: 4,
        score: 1,
        timestamp: 6,
        val: 8,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should return an object with a correct `chargeVol` object', () => {
    const actual = calculateArbitrage(data, key, period, .5).chargeVol
    const expected = {
      avgPrc: -.5,
      n: 2,
    }
    expect(actual).toEqual(expected)
  })

  test('should return an object with a correct `dischargeVol` object', () => {
    const actual = calculateArbitrage(data, key, period, .5).dischargeVol
    const expected = {
      avgPrc: 7,
      n: 2,
    }
    expect(actual).toEqual(expected)
  })
})
