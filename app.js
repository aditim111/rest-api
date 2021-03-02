const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors= require('cors')
const createError = require('http-errors')
var config = require('config');
require('dotenv/config')
const winston = require('./services/winston');
const helmet = require('helmet')


const app = express()


//Middlewares
app.use(require('express-status-monitor')());
app.use(bodyParser.json())
app.use(morgan('combined', { stream: winston.stream }));
app.use(helmet())
app.use(cors())

//Import routes
//Users
const usersRoute= require('./routes/users')
app.use('/users', usersRoute)
//download
const downloadRoute= require('./routes/download')
app.use('/download', downloadRoute)

app.get('/', async (req, res)=>{
    res.status(200).json({
    status: 'success',
    data: 'Rest API'
    });
})

app.use(async(req, res, next) => {
    next(createError.NotFound())
})

app.use((err, req, res, next) =>{
    winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    res.status(err.status || 500)

    res.send({
        error:{
            status: err.status || 500,
            message: err.message,
        }
    })
})

//connect to DB
mongoose.connect(process.env.DB_CONNECTION,
{ useNewUrlParser: true, useUnifiedTopology: true },
()=>
console.log('Connected to DB!'))


const port = config.get('config.port');
app.listen(port);
