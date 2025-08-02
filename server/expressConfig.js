import express from 'express'
import cors from 'cors'
import Router from '../routes/router.js'

const App = express()

App.use(express.json())
App.use(cors())

App.use(Router)


export default App
