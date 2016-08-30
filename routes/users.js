var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest : './uploads'});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

/* POST register user. */
router.post('/register', upload.single('profileimage'), function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  if(req.file){
    console.log('Uploading file');
    var profileimage = req.file.filename;
  }
  else {
    console.log('No file uploaded');
    var profileimage = 'noimage.jpeg';
  }
  //Form Validation
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Passwords do notmatch').equals(req.body.password);


  //Check Errors
  var errors = req.validationErrors();

  if(errors){
    res.render('register', {errors:errors});
  }
  else {
    console.log('No errors');
  }

});

module.exports = router;
