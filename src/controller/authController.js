const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const {tokenCreate} = require("../utility/tokenHelper");
const saltRounds = 10;
class authClass {
    signUp = async (req, res) => {
        let { Name, Email, Phone, Location, Gender, Image, Password, Re_type_Password } = req.body;

        try {
            // Check if the user email already exists
            let userEmail = await userModel.findOne({ Email: Email });
            if (userEmail) {
                return res.status(409).send({
                    status: "fail",
                    msg: "User email already exists"
                });
            }

            // Check if the passwords match
            if (Password !== Re_type_Password) {
                return res.status(400).send({
                    status: "fail",
                    msg: "Password does not match"
                });
            }


            const hashedPassword = await bcrypt.hash(Password, saltRounds);

            // Create a new user
            const newUser = new userModel({
                Name: Name,
                Email: Email,
                Phone: Phone,
                Location: Location,
                Gender: Gender,
                Image: Image,
                Password: hashedPassword, // Store the hashed password
                Re_type_Password: hashedPassword // Also store the hashed password here (not recommended to store this field)
            });

            // Save the user to the database
            await newUser.save();

            return res.status(201).json({
                status: "success",
                message: "User created successfully"
            });

        } catch (e) {
            return res.status(500).json({
                status: "fail",
                msg: "Something went wrong"
            });
        }
    };
    signIn = async (req, res) => {
        let { Email, Password } = req.body;

        try {
            let user = await userModel.findOne({ Email });

            if (!user) {
                return res.status(404).send({
                    status: "fail",
                    msg: "Invalid email"
                });
            }

            let matchPassword = await bcrypt.compare(Password, user.Password);

            if (!matchPassword) {
                return res.status(404).send({
                    status: "fail",
                    msg: "Invalid password"
                })
            }

            const jwtKey = process.env.JWT_KEY;
            let token = tokenCreate({ user }, jwtKey, "10d");

            return res.status(200).json({
                status: "success",
                token: token,
            });

        } catch (e) {

            return res.status(500).json({
                status: "fail",
                msg: "Something went wrong"
            });
        }
    };
    userProfile = async (req,res)=>{
        let Email = req.headers.Email;
        try{
            let filter = {Email:Email};
            let data = await userModel.findOne(filter);
            return res.status(200).json({
                status : "success",
                msg : "User profile find successfully",
                data : data
            })
        }catch (e) {
            return res.status(500).json({
                status : "fail",
                msg: "Something went wrong"
            })
        }
    };
    updateProfile = async (req,res)=>{
        let Email = req.headers.Email;
        try {
            let filter = {Email:Email};
            let {Name,Phone,Location,Gender,Image} = req.body;
            let update = {
                Name,
                Phone,
                Location,
                Gender,
                Image
            };
            let data = await userModel.findOneAndUpdate(filter,update,{new:true});
            return res.status(200).json({
                status : "success",
                msg : "User profile update successfully",
                data : data
            })
        }catch (e) {
            return res.status(500).json({
                status : "fail",
                msg : "Something went wrong"
            })
        }
    };
    allUser = async (req,res)=>{
        try{

        }catch (e){

        }
    };
}

const authController = new authClass();

module.exports = authController;