const {User} = require('../database/models/models');
const UserService = require('../services/user-service');
const TokenService = require('../services/token-service');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');


class UserController {

    async login(req, res, next) {
        try {
            const {login, password} = req.body;
            const user = await User.findOne({where: {login:login}});
            if(user != null) {
                if(bcrypt.hashSync(password, process.env.CRYPT_SALT) === user.password) {
                    const token = TokenService.generateAccessToken(user.dataValues);
                    res.clearCookie();
                    res.cookie('token', token, {
                        maxAge:3600*24,
                        HttpOnle:true,
                    })
                    res.status(200).json({token: token});
                }
            } else {
                res.status(400).json({message:"Неверный логин или пароль"});
            }
        } catch(e) {
            next(e)
        }
    }

    async register(req, res, next) {
        try {
            const {name, surname, email, login, password} = req.body;
            const check = await UserService.registrationCheck(login, email);
            if (check != null) {
                res.status(400).json({message:"пользователь с таким email или логином уже cуществует"})
            } else {
                const cryptPassword = await UserService.passwordHash(password);
                await User.create({
                    name:name,
                    surname:surname,
                    email:email,
                    login:login,
                    password:cryptPassword
                })
                res.status(201).json({message:"Регистрация успешна"})
            }
        } catch(e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            res.clearCookie();
            res.status(401).json({message:"Пользователь не авторизирован"});
        } catch(e) {
            next(e)
        }
    }

}

module.exports = new UserController();