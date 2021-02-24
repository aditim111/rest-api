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

//get
router.get('/', userController.getUser)

//post
router.post('/', userController.postUser )

//get user by id
router.get('/:userId', userController.getUserbyId)

//update 
router.patch("/:userId", userController.updateUser)

//delete user by id
router.delete('/:userId', userController.deleteUserbyId)

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