const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_KEY;


module.exports = (req,res,next)=>{
    let token = req.headers.authorization;
    let decodedToken = jwt.verify(token,jwtKey);
    if (decodedToken===null){
        return res.status(401).send({
            status : "fail",
            msg : "Unauthorized",
        })
    }else {
        let id = decodedToken.user._id;
        req.headers.id = id;
        let Email = decodedToken.user.Email;
        req.headers.Email = Email;
        next();
    }
};