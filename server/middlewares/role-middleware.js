const jwt = require('jsonwebtoken');

module.exports = function(roles) {
    return function(req, res, next) {
        if(req.method === 'OPTIONS') {
            next();
        }
        try {
            const token = req.headers.authorization.split(' ')[2];
            const user = jwt.verify(token, process.env.JWT_SECRET);
            let hashRole = false;
            roles.forEach(element => {
                if(element.includes(user.type)) {
                    hashRole = true;
                }
            });
            if(!hashRole) {
                return res.status(403).json({message:"пользователь не авторизован"});
            }
            next();
        } catch (error) {
            console.log(error);
            return res.status(403).json({message:"Нет необходимых прав доступа"});
        }
    }
}