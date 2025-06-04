const {User} = require('../database/models/models');
const UserService = require('../services/user-service');
const TokenService = require('../services/token-service');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


class UserController {

    async login(req, res, next) {
        try {
            const {login, password} = req.body;
            console.log(login, password)
            const user = await User.findOne({where: {login:login}});
            if(user != null) {
                if(bcrypt.hashSync(password, process.env.CRYPT_SALT) === user.password) {
                    const token = TokenService.generateAccessToken({
                        name:user.dataValues.name,
                        surname:user.dataValues.surname,
                        email:user.dataValues.email,
                        login:user.dataValues.login,
                        password:user.dataValues.password,
                        type:user.dataValues.type});
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

    async check(req, res, next) {
        try {
            const tokenOld = req.headers.authorization.split(' ')[1];
            const user = jwt.decode(tokenOld);
            const tokenNew = TokenService.generateAccessToken({
                id:user.id,
                name:user.name,
                surname:user.surname,
                email:user.email,
                login:user.login,
                password:user.password,
                type:user.type
            });
                    res.clearCookie();
                    res.cookie('token', tokenNew, {
                        maxAge:3600*24,
                        HttpOnle:true,
                    })
                    res.status(200).json({token: tokenNew});
        } catch(e) {
            console.log(e)
        }
    }

    async getAllUsers(rea, res, next) {
        try{
            const allUsers = await User.findAll({
                attributes: ['id', 'name', 'surname', 'email', 'type']
            });

            res.json(allUsers);
        } catch(e) {
            console.log(e)
            res.status(500).json({message:"Ошибка серввера"})
        }
    }

    async updateUser(req, res, next) {
        try{
            const {id} = req.body;

            const update = await User.update({
                type:"ADMIN"
            },
        {
            where: {
                id:id
            }
        })

        res.json({message:"Администратор назначен"})

        } catch(e) {
            console.log(e)
            res.status(500).json({message:"Ошибка серввера"})
        }
    }

    async deleteUser(req, res, next) {
        try {
            const {id} = req.body;

            const deleteUser = await User.destroy({
                where: {
                    id:id
                }
            })

            res.json({message:"пользователь удалён"})

        } catch(e) {
            console.log(e)
            res.status(500).json({message:"Ошибка серввера"})
        }
    }

}

module.exports = new UserController();