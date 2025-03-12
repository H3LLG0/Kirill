const Router = require('express');
const UserController = require('../controllers/user-controller');
const RoleMiddleware = require('../middlewares/role-middleware');
const AuthMiddleware = require('../middlewares/auth-middleware');

const userRouter = new Router();

userRouter.post('/login', UserController.login)
userRouter.post('/register', RoleMiddleware(['ADMIN']), AuthMiddleware, UserController.register)
userRouter.get('/check', AuthMiddleware, UserController.check)

module.exports = userRouter;