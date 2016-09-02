const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGOHQ_URL);
console.log(process.env.MONGOHQ_URL);

var db = mongoose.connection;

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    profileimage: {
        type: String
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
};

module.exports.getUserbyUsername = function(username, callback) {
    var query = {
        username: username
    };
    User.findOne(query, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        // res == true
        callback(null, isMatch);
    });
};

module.exports.createUser = function(newuser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newuser.password, salt, function(err, hash) {
            // Store hash in your password DB.
            newuser.password = hash;
            newuser.save(callback);
        });
    });

}
