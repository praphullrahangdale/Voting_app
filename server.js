const express = require('express')
const app = express()
const db = require('./db')
require('dotenv').config()

const bodyParser = require('body-parser')
app.use(bodyParser.json())
const PORT = process.env.PORT || 3000

const {jwtAuthMiddleware} = require('./jwt')


//Import the router files
const userRoutes = require('./Routes/userRoutes')
const candidateRoutes = require('./Routes/candidateRoutes')


//Use the routes
app.use('/user',userRoutes)
app.use('/candidate',candidateRoutes)

app.listen(PORT, ()=>{
    console.log('listening on port 3000')
})