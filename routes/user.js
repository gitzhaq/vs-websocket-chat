const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwtAuthenticator = require('../helpers/jwtAuthenticator');

// In this file the express router functions get/post are called

// POST register.
router.post('/register', (req, res, next) => {
    let { username, password } = req.body;
    username = username.toLowerCase();

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

            // Generate token
            const token = jwtAuthenticator.sign({username});
            result.message = 'Successfully registered';
            result.username = username;
            result.token = token;
            res.json(result);
        });
    });
});

// POST login.
router.post('/login', (req, res, next) => {
    let { username, password } = req.body;
    username = username.toLowerCase();

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
            if (!pwRes) {
                res.status(401).json(result);
            } else {
                // Generate token
                const token = jwtAuthenticator.sign({username});
                result.message = 'Successfully logged in';
                result.username = username;
                result.token = token;
                res.json(result);
            }
        });
    });
});

// GET check authentication.
router.get('/check-auth', (req, res) => {
    const token =
        req.body.token ||
        req.query.token ||
        req.headers['x-access-token'] ||
        req.cookies.token;

    if (!token) {
        // Send "401: Unauthorized" if no token is present
        res.status(401).send('Unauthorized: No token provided');
    } else {
        // Try to verify sent token
        jwtAuthenticator.verify(token, function(err, decoded) {
            if (err) {
                res.status(401).send('Unauthorized: Invalid token');
            } else {
                // Token verified
                res.send('Authorized');
            }
        });
    }
});

module.exports = router;
