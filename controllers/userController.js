const User = require('../models/User')
const { UserSchema, UserId , UpdateUserSchema, loginSchema} = require('../helpers/validation_schema');
const createError = require('http-errors');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../helpers/jwt_helper')

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
        const ValidatedUser = await UserSchema.validateAsync(req.body)
        const doesExist = await User.findOne({ email : ValidatedUser.email })
        if (doesExist) throw createError.Conflict(`${ValidatedUser.email} has already been registered.`)
        // const savedUser=await User.insertMany(ValidatedUser)    
        const user = new User(ValidatedUser)   
        const savedUser = await user.save()
        const accessToken = await signAccessToken(savedUser.id)
        const refreshToken = await signRefreshToken(savedUser.id)         
         

        res.status(201).json({
                status: 'success',
                accessToken: accessToken,
                refreshToken: refreshToken
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

        loginUser: async ( req , res , next )=>{ 
        try{
        const ValidatedSchema = await loginSchema.validateAsync(req.body)
        const user= await User.findOne({email: ValidatedSchema.email})
        if (!user) throw createError.NotFound('User not registered.')

        const isMatch = await user.isValidPassword(ValidatedSchema.password)
        if (!isMatch) throw createError.Unauthorized('Username/Password not valid.')

        const accessToken = await signAccessToken(user.id)
        const refreshToken = await signRefreshToken(user.id)         

            res.status(200).json({
                status: 'success',
                data: ({accessToken, refreshToken})
            });
        }catch (error) {
        if (error.isJoi === true)
            return next(createError.BadRequest('Username/Password invalid.'))
        next(error)
        }
    },

    refreshToken: async (req, res, next) =>{
        try {
            const { refreshToken } = req.body
            if (!refreshToken) throw createError.BadRequest()
            const userId = await verifyRefreshToken(refreshToken)

            const accessToken = await signAccessToken(userId)
            const refToken = await signRefreshToken(userId)

            res.status(200).json({
                status: 'success',
                data: ({accessToken: accessToken, refreshToken: refToken})
            });
        } catch (error) {
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
        if (validatedUserSchema.password) {
			user.ssnno = validatedUserSchema.password
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