const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_KEY;


const isLogIn = (req, res, next) => {
    try {
        let token =  req.headers.authorization;
        if(!token){
            token = req.cookies.accessToken
        }

        if (!token) {
            return res.status(401).json({
                status: "fail",
                msg: "Unauthorized user"
            });
        }



        // Verify the token

        const decode = jwt.verify(token, jwtKey);

        if (!decode) {
            return res.status(401).json({
                status: "fail",
                msg: "Invalid token, please log in"
            });
        }



        let _id = decode.user._id;
        req.headers._id = _id;
        let Email = decode.user.Email;
        req.headers.Email = Email
        next();


    } catch (error) {
        return res.status(500).json({
            status: "error",
            msg: error.message
        });
    }
};

module.exports = {isLogIn};