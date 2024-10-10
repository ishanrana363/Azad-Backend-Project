const userModel = require("../models/userModel");

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
}

const authController = new authClass();

module.exports = authController;