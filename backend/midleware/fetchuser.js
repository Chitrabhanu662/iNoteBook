
var jwt = require('jsonwebtoken');

const JWT_SECRET = 'chitrabhanuisagoodb$oy'

const fetchuser = (req, res, next) => {
    // Get the user from the jwt token and add id to req object 
    const token = req.header('auth-token');
    try {
        if (!token) {
            res.status(401).send({ error: "you are almost there keep it up" })
        }

        const data = jwt.verify(token, JWT_SECRET);
         req.user = data.user;
        next();
    }

    catch (error) {

      res.status(401).send({ error: "Please authenticate using a valid token" })
    }

}
module.exports = fetchuser;