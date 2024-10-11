const otpModel = require("../models/otpModel");
const userModel = require("../models/userModel");
const SendEmailUtility = require("../utility/emailUtility");
const bcrypt = require("bcrypt");
class forgetPasswordClass {
     sendEmailUser = async (req, res) => {
        const { Email } = req.body;
        const otpCode = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
        const emailSubject = "Task Tracker OTP Code";
        const emailText = `Your OTP code is ${otpCode}`;
        const filter = { Email };

        try {
            const user = await userModel.findOne(filter);

            if (user) {
                // Send OTP email
                await SendEmailUtility(Email, emailText, emailSubject);

                // Update or insert OTP in the database
                await otpModel.findOneAndUpdate(
                    { Email },
                    { $set: { otp: otpCode } },
                    { upsert: true }
                );

                return res.status(200).json({
                    status: "success",
                    msg: "6-digit OTP has been sent successfully"
                });
            } else {
                return res.status(404).json({
                    status: "fail",
                    msg: "User not found"
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: "fail",
                msg: "Something went wrong"
            });
        }
    };

     verifyOtp = async (req,res)=>{
         let { Email } = req.body;
         let status = 0;
         let otpCode = req.body.otp;
         let statusUpdate = 1;
         try{
             let result = await otpModel.findOne({Email:Email,otp:otpCode,status:status});
             if(result){
                 await otpModel.findOneAndUpdate({Email:Email,otp:otpCode,status:status},{status: statusUpdate});
                 return res.status(200).json({
                     status : "success",
                     msg : "Otp verification successfully",
                 })
             }else {
                 return res.status(404).json({
                     status : "fail",
                     msg : "Otp not found"
                 })
             }
         }catch (e) {
             res.status(500).json({
                 status : "fail",
                 msg: "Something went wrong"
             })
         }
     };

     resetPassword = async (req,res)=>{
        let { Email } = req.body;
        const password = req.body.Password;
        const filter = {Email:Email};
        try{
            let result = await userModel.findOne(filter);
            if(result){
                let statusData = 0;
                let otpData = 0;
                const saltRounds = 10;
                const newPassword = await bcrypt.hash(password, saltRounds);
                await userModel.findOneAndUpdate({Email: Email},{Password: newPassword});
                await otpModel.findOneAndUpdate( {Email :Email },  { otp : otpData, status : statusData } );
                return res.status(200).json({
                    status : "success",
                    msg : "Password reset successfully"
                });
            }else {
                return res.status(404).json({
                    status : "fail",
                    msg : "Password reset fail"
                });
            }
        }catch (e) {
            return res.status(500).json({
                status : "fail",
                msg : "Something went wrong"
            })
        }

     };

}

const forgetPasswordController = new forgetPasswordClass();

module.exports = forgetPasswordController;