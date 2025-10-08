const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

exports.resetPasswordToken = async(req,res) =>{
    try {
        //fecth email from req body//
    const email = req.body.email;
    //check is user exist or not//
    const user = await User.findOne({email:email});
    if(!user){
        return res.status(401).json({
            success:false,
            message:"Email ID is not registered",
        })
    }
    //generate token//
    const token = crypto.randomUUID();
    //update user by adding Token and expiration time//
    const updatedDetails = await User.findOneAndUpdate({email},{
        token:token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,

    },{new:true});
    //email url//
    const url = `http://localhost:3000/update-password/${token}`
    //send email containing the url//
    await mailSender(email,"Password Reset Link",`Password Reset Link : ${url}`);
    //return response//
    return res.status(200).json({
        success:true,
        message:"Password Reset Email Sent Successfully, Pls Check Your 📧 and Change Password",
    })
    } catch (error) {
        console.log(error);
        return res.status(500),json({
            success:false,
            message:"Something Went Wrong While Sending  the Reset Password Mail, pls try again later 😢"
        })
    }

}

//reset password controller//
exports.resetPassword = async(req,res)=>{
    try {
        //fetch data//
        const{password,confirmPassword,token} = req.body;
        //validation of password and confirmPassword//
        if(password !== confirmPassword){
            return res.status(401).json({
                success:false,
                message:"Password and ConfirmPassword do not Match",
            })
        }
        //get user details from db using token//
        const userDetails =  await User.findOne({token:token});
        //if Token is invalid//
        if(!userDetails){
            return res.status(401).json({
                success:false,
                message:"Invalid Token",
            })
        }
        //check if  token is valid//
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success:false,
                message:"Token is Expired, Pls Regenerate The Token",
            })
        }
        //hash the password//
        const hashedpassword = bcrypt.hash(password,10);
        await User.findOne({token:token},{password:hashedpassword},{new:true});
        //return response//
        return res.status(200).json({
            success:true,
            message:"Password Reset Successfull",
        })

    } catch (error) {
         console.log(error);
        return res.status(500),json({
            success:false,
            message:"Something Went Wrong While Resetting the  Password , pls try again later 😢"
        })
    }
}