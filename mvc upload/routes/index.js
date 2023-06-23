// npm start

var express = require('express');
var router = express.Router();
const multer = require('multer');
const bodyparser = require('body-parser');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

const uploader = multer({ dest: './temp' });

/* GET home page. */
router.get('/', function(req, res, next) {



  
  res.render('index', { title: 'Express upload'});
});


router.get('/upload', function(req, res, next) {
  res.render('upload', { title: 'Upload' });
});

router.post('/file', uploader.array('upload', 5), async function(req, res, next) {
  console.log(req.body);
  console.log(req.files);

  const timestamp = new Date().getTime();
  const formattedDate = moment(timestamp).format('MMMM_DD_YYYY__h_mm__ss');
  const username = req.body.username;


  const userFolderPath = path.join(__dirname, '..', 'uploads', username);
  if (!fs.existsSync(userFolderPath)) {
    fs.mkdirSync(userFolderPath);
  }


  const filePromises = req.files.map((file) => {
    const destinationPath = path.join(userFolderPath, `${formattedDate}____${username}_${file.originalname}`);
    return new Promise((resolve, reject) => {
      fs.rename(file.path, destinationPath, function(err) {
        if (err) {
          console.log('Error renaming file:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });


  try {
    await Promise.all(filePromises);
    res.redirect('/');
  } catch (err) {
    res.sendStatus(500); 
  }
});

router.use('/upload', [express.json(), bodyparser.urlencoded({ extended: true })]);

module.exports = router;