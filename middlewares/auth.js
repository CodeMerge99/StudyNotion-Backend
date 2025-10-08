const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();


exports.auth = async(req,res,next) =>{
    try {
        //extract token//
        const token = req.cookie || req.body.token || req.header("Authorisation").replace("Bearer","");
        //if token is missing//
        if(!token){
            return res.status(401).json({
                 success:false,
                 message:"Token is Missing",
            })
        }
        //verrify the token//
        try {
            const decode =  jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        } catch (error) {
            return res.status(401).json({
                success:false,
                message:"Token is Invalid",
            })
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"SomeThing went wrong While Validating the Token",
        })
    }
}

//isStudent middleware//
exports.isStudent = async(req,res,next) =>{
    try {
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected Route for students Only",
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User cannot be verified at the moment, Pls try again Later",
        })
    }
}

//isIntructor miidleware//

exports.isInstructor = async(req,res,next) =>{
    try {
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected Route for Instructor Only",
            })
        }
        next();
    } catch (error) {
         console.log(error);
         return res.status(500).json({
            success:false,
            message:"User cannot be verified at the moment, pls try later"
         })
    }
}

//isAdmin middleware//
exports.isAdmin = async(req,res,next)=>{
    try {
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected Route for Admin Only,"
            })
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be verified at the moment, pls try later",
        })
    }
}