const User = require('../models/User')
const { UserSchema } = require('../helpers/validation_schema');
const createError = require('http-errors');

module.exports={
    getUser: async (req,res)=>{
    try{
        const users= await User.find()
            res.status(200).json({
            status: 'success',
            data: users
        });
        console.log(users)
    }catch(err){
        res.json({message: err})
    }
},
    postUser: async (req, res, next)=>{   
    try{
        const result = await UserSchema.validateAsync(req.body)

        const doesExist = await User.findOne({ email : result.email })
        if (doesExist) throw createError.Conflict(`${result.email} has already been registered.`)
        const savedUser=await User.insertMany(result)

        res.status(201).json({
                status: 'success',
                data: savedUser
            });

    }catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error)
    }   
},
    getUserbyId: async(req,res)=>{ 
        try{
        const user= await User.findById(req.params.userId)
            res.status(200).json({
                status: 'success',
                data: user
            });
        }catch(err){
            res.json({message : err})
        }
    },
    deleteUserbyId: async(req,res)=>{
        try{
            const removedUser = await User.remove({_id:req.params.userId})
                res.status(204).json({
                status: 'success',
                data: null
            });

        }catch(err){
            res.json({ message : err})
        }
    }
}