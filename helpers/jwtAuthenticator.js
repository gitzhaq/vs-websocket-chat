const jwt = require('jsonwebtoken');

class JWTAuthenticator {
    static secret = 'SecretSocket5';

    verify(token, callback) {
        return jwt.verify(token, JWTAuthenticator.secret, callback);
    }

    sign(payload) {
        return jwt.sign(payload, JWTAuthenticator.secret, {
            expiresIn: '1d'
        });
    }
}

module.exports = new JWTAuthenticator();