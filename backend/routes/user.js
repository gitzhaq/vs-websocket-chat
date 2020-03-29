/**
 * In this file the express router functions get/post are called
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwtAuthenticator = require('../helpers/jwtAuthenticator');

/**
 * POST register.
 */
router.post('/register', (req, res, next) => {
    const { username, password } = req.body;
    const result = {message: "This username exists already. Sorry 'bout that..."};

    User.findOne({username: username}, function (err, user) {
        // Check if there was an error
        if (err) {
            next(err);
        }

        // Check if user already exists
        if (user) {
            res.status(401).json(result);
            return;
        }

        // Hash password
        bcrypt.hash(password, 10, function (err, hash) {
            // Check if there was an error
            if (err) {
                next(err);
                return;
            }

            // Create user and insert data
            const newUser = new User();

            newUser.username = username;
            newUser.password = hash;

            // Save user in database
            newUser.save(function (err) {
                if (err) {
                    next(err);
                }
            });

            result.message = 'Successful registered';
            res.json(result);
        });
    });
});

/**
 * POST login.
 */
router.post('/login', (req, res, next) => {
    const { username, password } = req.body;
    const result = {message: 'Some credentials are wrong here...'};

    // Check if user email exists
    User.findOne({username: username}, function (err, user) {
        // Check if there was an error
        if (err) {
            next(err);
            return;
        }

        // Check if user was found
        if (!user) {
            res.status(401).json(result);
            return;
        }

        // Check if correct password
        user.validPassword(password, function (err, pwRes) {
            // Check if there was an error
            if (err) {
                next(err);
                return;
            }

            // Check if password is valid
            if (!res) {
                res.status(401).json(result);
            } else {
                // Generate token
                const token = jwtAuthenticator.sign({username});
                result.message = 'Successfully logged in';
                result.token = token;
                res.json(result);
            }
        });
    });
});

module.exports = router;
