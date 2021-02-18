const mongoose = require('mongoose')

const UserSchema=mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email :{
        type: String,
        required: true,
        lowercase : true,
        unique: true
    },
    phone :{
        type: Number, 
        required: true
    },
    age :{
        type: Number, 
        required: true
    },
    ssnno :{
        type: Number, 
        required: true
    },
    date : {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Users', UserSchema)