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
    })
});

module.exports = router