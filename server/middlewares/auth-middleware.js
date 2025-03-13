const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    if(req.method === 'OPTIONS'){
        next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        if(token === "null") {
            return res.status(401).json({message:'пользователь не авторизован'})
        }
        else {
            const decodedData = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decodedData;
            next();
        }
    } catch(e) {
        console.log(e);
        res.status(401).json({message:"пользователь не авторизован"})
    }
}