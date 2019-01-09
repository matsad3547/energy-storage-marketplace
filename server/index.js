const express = require('express')
const compression = require('compression')
require('isomorphic-fetch')
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')

const {
  sse,
  getCompressionOptions,
} = require('./middleware')

const eia = require('./app/eiaRequest')

const {
  createUser,
  login,
} = require('./user/')

const {
  getDashboardConfig,
  getDashboardData,
  getThreeWeekData,
} = require('./product/')

const {
  createNewProject,
  deleteProjectById,
  getProjectById,
} = require('./project/')

const { getNodes } = require('./processes/')

const app = express()

app.set('port', process.env.PORT || 5000)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('server/public'))
}

const server = app.listen(app.get('port'), err => {
  if (err) {
    throw new Error(err)
    console.error('An error occured:', err)
  }
  console.log(`Find the server at: http://localhost:${app.get('port')}`)
})

//set up middlewares

app.use(express.static('public'))

app.use(bodyParser.json())

app.use(compression(getCompressionOptions))

app.use(sse)

//user
app.post('/createUser', createUser)
app.post('/login', login)

//dashboard
app.post('/get_dashboard_config', getDashboardConfig)
app.get('/get_dashboard_data/:id', getDashboardData)

app.get('/get_nodes', getNodes)
app.post('/create_project', createNewProject)

//project page
app.post('/get_project', getProjectById)
app.delete('/delete_project', deleteProjectById)

// last 3 weeks
app.post('/get_3_week_data', getThreeWeekData)

const roiTest = (req, res) => {

  console.log('running roi test');

  const { id } = req.params

  res.sseSetup()

  let n = 0

  // run to send initial data
  res.sseSend({cheese: `dicks - ${n}`,})

  n = 1

  const int = setInterval( () => {
    // run to send follow up data
    res.sseSend({cheese: `balls - ${n}`,})
    n++
  }, 3 * 60 * 1000)

  req.on('close', () => {
    clearInterval(int)
    res.sseClose()
  })
}

app.get('/get_roi/:id', roiTest)
