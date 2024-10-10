const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const {tokenCreate} = require("../utility/tokenHelper");

class authClass {
    signUp = async (req, res) => {
        let {Name,Email,Phone,Location,Gender,Image,Password,Re_type_Password} = req.body;
        let reqBody = req.body;
        try{
            let userEmail = await userModel.findOne({Email:Email});
            if(userEmail){
                return res.status(409).send({
                    status : "fail",
                    msg : "User email already exists "
                })
            }
            if (Password!==Re_type_Password){
                return res.status(400).send({
                    status : "fail",
                    msg : "Password is not match"
                })
            }
            let data = await userModel.create(reqBody);
            return res.status(201).json({
                status : "success",
                msg : "User signed up successfully",
                data : data
            })
        }catch (e) {
            console.log(e);
            return res.status(500).json({
                status : "fail",
                msg : "Something went wrong"
            })
        }
    };
    signIn = async (req, res) => {
        let {Email,Password} = req.body;
        try {
            let user = await userModel.findOne({Email:Email});
            if (!user){
                return res.status(404).send({
                    status : "fail",
                    msg : "Invalid email"
                })
            }
            const matchPassword = bcrypt.compareSync(Password, user.Password);
            if (!matchPassword) {
                return res.status(403).json({
                    status: "fail",
                    msg: "password not match",
                });
            }
            const jwtKey = process.env.JWT_KEY
            let token = tokenCreate({user},jwtKey,"10d");
            return res.status(200).json({
                status: "success",
                token: token,
            });
        }catch (e) {
            return res.status(500).json({
                status : "fail",
                msg: "Something went wrong"
            })
        }
    };
}

const authController = new authClass();

module.exports = authController;