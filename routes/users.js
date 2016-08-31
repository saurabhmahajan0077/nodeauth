var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest : './uploads'});
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = require('../models/user');

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

/* Login */
router.post('/login',  passport.authenticate('local', {failureRedirect: '/users/login', failureFlash : 'Invalid Credentials'}),
function(req, res) {
  req.flash('success', 'logged in');
  res.redirect('/')
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new localStrategy( function (username, password, done){
  User.getUserbyUsername(username, function(err, user){
    if (err) throw err;
    if(!user){
      return done (null, false, {message: 'Unknown User'});
    }

    User.comparePassword(password, user.password, function(err, isMatch){
      if(err) return done(err);
      if(isMatch){
        return done(null, user);
      } else {
        return done(null, false, {message: 'Invalid Credentials'});
      }
    });
  });
}));

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
    var newUser = new User({
      name : name,
      email : email,
      username : username,
      password : password,
      profileimage : profileimage
    });

    User.createUser(newUser, function(err, user){
      if(err) throw err;
      console.log(user);
    });

    req.flash('Success', 'Registered User');
    res.location('/');
    res.redirect('/');
  }
});

router.get('/logout', function(req, res, next){
  req.logout();
  req.flash('sucess', 'Logged Out');
  res.redirect('/users/login');
});
module.exports = router;
