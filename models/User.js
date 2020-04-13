const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

/**
 * Mongoose database schema for users
 */
const schema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
});

schema.methods.validPassword = function (password, callback) {
    bcrypt.compare(password, this.password, function (err, res) {
        if (err) {
            return callback(err);
        }
        else {
            return callback(null, res);
        }
    });
};

module.exports = mongoose.model('User', schema);