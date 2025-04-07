const Router = require('express');
const UserController = require('../controllers/user-controller');
const RoleMiddleware = require('../middlewares/role-middleware');
const AuthMiddleware = require('../middlewares/auth-middleware');

const userRouter = new Router();

userRouter.post('/login', UserController.login)
userRouter.post('/register', RoleMiddleware(['ADMIN']), AuthMiddleware, UserController.register)
userRouter.get('/check', AuthMiddleware, UserController.check);
userRouter.get('/getUsers', RoleMiddleware(['ADMIN']), AuthMiddleware, UserController.getAllUsers)
userRouter.post('/userToAdmin', AuthMiddleware, RoleMiddleware(['ADMIN']), UserController.updateUser)
userRouter.post('/deleteUser', AuthMiddleware, RoleMiddleware(['ADMIN']), UserController.deleteUser)

module.exports = userRouter;