const User = require('../models/User')
const { UserSchema, UserId , UpdateUserSchema} = require('../helpers/validation_schema');
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
        const ValidatedUser = await UserSchema.validateAsync(req.body.user)
        const doesExist = await User.findOne({ email : ValidatedUser.email })
        if (doesExist) throw createError.Conflict(`${ValidatedUser.email} has already been registered.`)
        const savedUser=await User.insertMany(ValidatedUser)

        res.status(201).json({
                status: 'success',
                data: savedUser
            });

    }catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error)
    }   
},
    getUserbyId: async ( req , res , next )=>{ 
        try{
        const ValidatedId = await UserId.validateAsync(req.params)
        const user= await User.findById(ValidatedId.userId)
            res.status(200).json({
                status: 'success',
                data: user
            });
        }catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error)
        }
    },
    updateUser: async (req, res, next) => {
	try {
        const ValidatedId = await UserId.validateAsync(req.params)
        const user = await User.findById(ValidatedId.userId)

        const validatedUserSchema = await UpdateUserSchema.validateAsync(req.body)
		if (validatedUserSchema.name) {
			user.name = validatedUserSchema.name
        }
        if (validatedUserSchema.email) {
			user.email = validatedUserSchema.email
        }
        if (validatedUserSchema.phone) {
			user.phone = validatedUserSchema.phone
        }
        if (validatedUserSchema.age) {
			user.age = validatedUserSchema.age
        }
        if (validatedUserSchema.ssnno) {
			user.ssnno = validatedUserSchema.ssnno
        }

        await user.save()
        res.status(204).end()

	    }catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error)
        }
},
    deleteUserbyId: async(req,res)=>{
        try{
            const ValidatedUser = await UserId.validateAsync(req.params)
            const removedUser = await User.remove({_id:ValidatedUser.userId})
                res.status(204).json({
                status: 'success',
                data: null
            });

        }catch(err){
            res.json({ message : err})
        }
    }
}