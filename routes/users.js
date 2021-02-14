const express = require('express')
const router = express.Router()
const User = require('../models/User')
const fs = require('fs');
const moment = require('moment');
const json2csv = require('json2csv').parse;
const path = require('path')
const multer = require('multer');
const csv = require('fast-csv');

//get
router.get('/', async (req,res)=>{
    try{
        const users= await User.find()
        res.json(users)
        console.log(users)
    }catch(err){
        res.json({message: err})
    }
})

//post
router.post('/', async (req, res)=>{
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        age: req.body.age,
        ssnno: req.body.ssnno,
    });    
    try{
    const savedUser=await User.insertMany(req.body.user)
    res.json(savedUser)
    }catch(err){
         res.json({message: err})

    }
   
})


//get user by id
router.get('/:userId', async(req,res)=>{
   
    try{
    const user= await User.findById(req.params.userId)
    res.json(user)
    }catch(err){
        res.json({message : err})
    }
})

//delete user by id
router.delete('/:userId', async(req,res)=>{
    try{
        const removedUser = await User.remove({_id:req.params.userId})
        res.json(removedUser)

    }catch(err){
        res.json({ message : err})
    }
})


// //download
// const fields = ['name', 'email', 'phone', 'age', 'ssnno'];
// router.get('/download', async function (req, res) {
//   await User.find({}, function (err, users) {
//     if (err) {
//       return res.status(500).json({ err });
//     }
//     else {
//       let csv
//       try {
//         csv = json2csv(users, { fields });
//       } catch (err) {
//         return res.status(500).json({ err });
//       }
//       const dateTime = moment().format('YYYYMMDDhhmmss');
//       const filePath = path.join(__dirname, "..", "downloads", "csv-" + dateTime + ".csv")
//       fs.writeFile(filePath, csv, function (err) {
//         if (err) {
//           return res.json(err).status(500);
//         }
//         else {
//           setTimeout(function () {
//             fs.unlinkSync(filePath); // delete this file after 30 seconds
//           }, 30000)
//           return res.json("/downloads/csv-" + dateTime + ".csv");
//         }
//       });

//     }
//   })
// })

//upload

//for validation
function validateCsvData(rows) {
  const dataRows = rows.slice(1, rows.length); //ignore header at 0 and get rest of the rows
  for (let i = 0; i < dataRows.length; i++) {
    const rowError = validateCsvRow(dataRows[i]);
    if (rowError) {
      return `${rowError} on row ${i + 1}`
    }
  }
  return;
}
function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
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

  // open uploaded file
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
      fs.unlinkSync(req.file.path);   // remove temp file
    
      const validationError = validateCsvData(fileRows);
      if (validationError) {
        return res.status(403).json({ error: validationError });
      }
      //else process "fileRows" and respond
      return res.json({ message: "valid csv" })


    })
});

module.exports = router