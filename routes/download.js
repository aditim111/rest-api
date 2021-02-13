const express = require('express')
const router = express.Router()
const User = require('../models/User')
const fs = require('fs');
const moment = require('moment');
const json2csv = require('json2csv').parse;
const path = require('path')


//download
const fields = ['name', 'email', 'phone', 'age', 'ssnno'];
router.get('/', async  (req, res)=> {
  await User.find({},  (err, users) =>{
    if (err) {
      return res.status(500).json({ err });
    }
    else {
      let csv
      try {
        csv = json2csv(users, { fields });
      } catch (err) {
        return res.status(500).json({ err });
      }
      const dateTime = moment().format('YYYYMMDDhhmmss');
      const filePath = path.join(__dirname, "..", "downloads", "csv-" + dateTime + ".csv")
      fs.writeFile(filePath, csv, function (err) {
        if (err) {
          return res.json(err).status(500);
        }
        else {
          setTimeout( ()=> {
            fs.unlinkSync(filePath); // delete this file after 30 seconds
          }, 30000)
          return res.json("/downloads/csv-" + dateTime + ".csv");
        }
      });

    }
  })
})
module.exports = router
