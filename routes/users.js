const express = require('express')
const router = express.Router()
const User = require('../models/User')
const fs = require('fs');
const moment = require('moment');
const json2csv = require('json2csv').parse;
const path = require('path')
const multer = require('multer');
const csv = require('fast-csv');
const { UserSchema } = require('../helpers/validation_schema');
const createError = require('http-errors');
const userController = require('../controllers/userController')
const { verifyAccessToken } = require('../helpers/jwt_helper')

//User Component
/**
* @swagger
* components:
*   schemas:
*     User:
*        type: object
*        properties:
*          id:
*            type: integer
*            description: Auto generated user ID by MongoDB.
*            example: 603752d62ba5ca3ae441bcfc
*          name:
*            type: string
*            description: The user's name.
*            example: Leanne Graham
*          email:
*            type: string
*            description: The user's email.
*            example: leannegraham@gmail.com
*          password:
*            type: string
*            description: The user's password.
*            example: StR0nGPa$$w0rd
*          phone:
*            type: number
*            description: The user's phone number.
*            example: 9999999
*          age:
*            type: number
*            description: The user's age.
*            example: 32
*          ssnno:
*            type: number
*            description: The user's SSN.
*            example: 123456
*          date:
*            type: string
*            description: The user's date of registration.
*            example: 2021-02-25T07:33:42.384Z
*/


//GET
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users.
 *     description: Retrieve a list of users from MongoDB. Can be used to populate a list of fake users when prototyping or testing an API.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
router.get('/', verifyAccessToken, userController.getUser)

//REGISTER
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Register a single user.
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Auto generated user ID by MongoDB.
 *                         example: 603752d62ba5ca3ae441bcfc
 *                       name:
 *                         type: string
 *                         description: The user's name.
 *                         example: Leanne Graham
 *                       email:
 *                         type: string
 *                         description: The user's email.
 *                         example: leannegraham@gmail.com
 *                       password:
 *                         type: string
 *                         description: The user's password.
 *                         example: StR0nGPa$$w0rd
 *                       phone:
 *                         type: number
 *                         description: The user's phone number.
 *                         example: 9999999
 *                       age:
 *                         type: number
 *                         description: The user's age.
 *                         example: 32
 *                       ssnno:
 *                         type: number
 *                         description: The user's SSN.
 *                         example: 123456
 *                       date:
 *                         type: string
 *                         description: The user's date of registration.
 *                         example: 2021-02-25T07:33:42.384Z
 */

router.post('/register', userController.postUser )


//LOGIN
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a single user.
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                         description: The user's email.
 *                         example: leannegraham@gmail.com
 *                       password:
 *                         type: string
 *                         description: The user's password.
 *                         example: StR0nGPa$$w0rd
 */
router.post('/login', userController.loginUser)

//Refresh token
/**
 * @swagger
 * /users/refresh-token:
 *   post:
 *     summary: Refresh Token.
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: token
 *                         description: User's refresh token.
 *                         example: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImp0aSI6IjEyM2VmZmY1LTIyMzktNDc3MS1iNjQzLTc4ODBlMjE4OGJiZSIsImlhdCI6MTYxNTc0NTY5MywiZXhwIjoxNjE1NzQ5MjkzfQ.4svnd3v4-k_bW7Tt9H7IPe6nPJvQjyzxEsl9QsMClpE'

 */
router.post('/refresh-token', userController.refreshToken)

//GET user by ID

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retrieve a single user.
 *     description: Retrieve a single from MongoDB. 
 *     responses:
 *       200:
 *         description: A single user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to retrieve.
 *         schema:
 *           type: integer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Auto generated user ID by MongoDB.
 *                         example: 603752d62ba5ca3ae441bcfc
 *                       name:
 *                         type: string
 *                         description: The user's name.
 *                         example: Leanne Graham
 *                       email:
 *                         type: string
 *                         description: The user's email.
 *                         example: leannegraham@gmail.com
 *                       password:
 *                         type: string
 *                         description: The user's password.
 *                         example: StR0nGPa$$w0rd
 *                       phone:
 *                         type: number
 *                         description: The user's phone number.
 *                         example: 9999999
 *                       age:
 *                         type: number
 *                         description: The user's age.
 *                         example: 32
 *                       ssnno:
 *                         type: number
 *                         description: The user's SSN.
 *                         example: 123456
 *                       date:
 *                         type: string
 *                         description: The user's date of registration.
 *                         example: 2021-02-25T07:33:42.384Z
 */

router.get('/:userId', verifyAccessToken, userController.getUserbyId)

//update 

/**
 * @swagger
 * /users/{userId}:
 *   patch:
 *     summary: Update a single user.
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Auto generated user ID by MongoDB.
 *                         example: 603752d62ba5ca3ae441bcfc
 *                       name:
 *                         type: string
 *                         description: The user's name.
 *                         example: Leanne Graham
 *                       email:
 *                         type: string
 *                         description: The user's email.
 *                         example: leannegraham@gmail.com
 *                       password:
 *                         type: string
 *                         description: The user's password.
 *                         example: StR0nGPa$$w0rd
 *                       phone:
 *                         type: number
 *                         description: The user's phone number.
 *                         example: 9999999
 *                       age:
 *                         type: number
 *                         description: The user's age.
 *                         example: 32
 *                       ssnno:
 *                         type: number
 *                         description: The user's SSN.
 *                         example: 123456
 *                       date:
 *                         type: string
 *                         description: The user's date of registration.
 *                         example: 2021-02-25T07:33:42.384Z
 */

router.patch("/:userId", verifyAccessToken, userController.updateUser)

//delete user by id
/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Delete a single user.
 *     requestBody:
 *       required: true
 *     responses:
 *       204:
 *         description: Deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Auto generated user ID by MongoDB.
 *                         example: 603752d62ba5ca3ae441bcfc
 */

router.delete('/:userId', verifyAccessToken, userController.deleteUserbyId)

//upload
//for validation
function validateCsvData(rows) {
  const dataRows = rows.slice(1, rows.length); 
  for (let i = 0; i < dataRows.length; i++) {
    const rowError = validateCsvRow(dataRows[i]);
    if (rowError) {
      return `${rowError} on row ${i + 1}`
    }
  }
  return;
}

function validateCsvRow(row) {
  if (!row[0]) {
    return "invalid name"
  }
 else if (!row[1]){
    return "invalid email"
  }

  else if (!Number.isInteger(Number(row[2]))) {
    return "invalid phone number"
  }
   else if (!Number.isInteger(Number(row[3]))) {
    return "invalid age"
  }
     else if (!Number.isInteger(Number(row[4]))) {
    return "invalid ssn no."
  }
  return;
}

const upload = multer({ dest: 'tmp/csv/' });
router.post('/upload', upload.single('file'), async (req, res) =>{
  const fileRows = [];

  await csv.parseFile(req.file.path)
    .on("data", function (data) {
      fileRows.push({
      name: data[0],
      email: data[1],
      phone: data[2],
      age: data[3],
      ssnno: data[4],
    });
    })
    .on("end",  ()=> {
        fileRows.shift();
        console.log(fileRows)
        User.insertMany(fileRows, (err, res) => {
        if (err) throw err;
        console.log(`Inserted rows`);
        });
      fs.unlinkSync(req.file.path);   
    
      const validationError = validateCsvData(fileRows);
      if (validationError) {
        return res.status(403).json({ error: validationError });
      }
      return res.json({ message: "valid csv" })


    })
});

module.exports = router