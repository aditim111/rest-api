const mongoose = require('mongoose')

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};


//Name, email, phone no, age, SSN no
const UserSchema=mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email :{
        type: String,
        required: true,
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
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