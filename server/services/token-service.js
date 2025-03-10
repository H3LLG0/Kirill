const jwt = require('jsonwebtoken');


class TokenService {
    generateAccessToken(user) {
        return jwt.sign(user, process.env.JWT_SECRET, {expiresIn:'24h'});
    }
}

module.exports = new TokenService();