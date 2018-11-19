const express = require('express')
require('isomorphic-fetch')
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')

const eia = require('./app/eiaRequest')

const {
  createUser,
  login,
} = require('./user/')

const { getDashboardData } = require('./product/')

const {
  createNewProject,
  deleteProjectById,
  getProjectById,
} = require('./project/')

//for testing python
// const { demoProcess } = require('./processes/')

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

server.setTimeout = 200000

app.use(express.static('publick'))

app.use(bodyParser.json())

app.post('/get_dashboard', getDashboardData)

app.post('/createUser', createUser)
app.post('/login', login)

app.post('/create_project', createNewProject)
app.post('/get_project', getProjectById)
app.delete('/delete_project', deleteProjectById)
