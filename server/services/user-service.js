const {User} = require('../database/models/models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

class UserService {
    async registrationCheck (login, email) {
        const check = await User.findOne({where: {[Op.or]: [{login:login}, {email:email}]}})
        return check;
    }
    async passwordHash(password) {
       const hashedPassword = await bcrypt.hash(password, process.env.CRYPT_SALT)
       return hashedPassword;
    }
    async userCheck() {
        
    }
}

module.exports = new UserService()