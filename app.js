const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors= require('cors')
require('dotenv/config')

//Middlewares
app.use(cors())
app.use(bodyParser.json())

//Import routes
const usersRoute= require('./routes/users')
app.use('/users', usersRoute)
//download
const downloadRoute= require('./routes/download')
app.use('/download', downloadRoute)

app.get('/', (req, res)=>{
    res.send('Rest API Assignment')
})

//connect to db
mongoose.connect(process.env.DB_CONNECTION,
{ useNewUrlParser: true, useUnifiedTopology: true },
()=>
console.log('Connected to DB!'))

app.listen(3000);
