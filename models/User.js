const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')


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
    password :{
        type: String,
        required: true,
        max: 1024,
        min: 6
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

UserSchema.pre('save', async function (next) {
    try{

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
        next()
    }catch(error){
        next(error)
    }
    
})

UserSchema.methods.isValidPassword = async function (password){
    try {
        return await bcrypt.compare(password, this.password)
        
    } catch (error) {
        throw error
        
    }
}
module.exports = mongoose.model('Users', UserSchema)