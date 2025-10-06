const User = require("../models/User");
const OTP =  require("../models/OTP");
const otpGenertor = require("otp-generator");
const bcrypt = require("bcrypt");


//sendOTP controller//
exports.sendOTP = async(req,res)=>{
    try {
        //fetch email from request body//
    const {email} = req.body;
    //checck if user already exist//
    const checkUserPresent = await User.findOne({email});
    if(checkUserPresent){
        return res.status(401).json({
            success:false,
            message:"User already registered"
        })
    }
    //generate OTP//
    let otp = otpGenertor.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    })
    console.log("OTP generated is :",otp);
    //check if otp is unique or not//
    const result  = await OTP.find({otp:otp});
    while(result){
        otp = otpGenertor(6,{
          upperCaseAlphabets:false,
          lowerCaseAlphabets:false,
          specialChars:false,
        })
        result = await OTP.find({otp:otp});
    }
    const otpPayload = {email,otp};
    //create an entry for otp in db//
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);
    //return response//
    res.status(200).json({
        success:true,
        message:"OTP sent Successfully",
        otp,
    })

    } catch (error) {
      console.log(error);
      res.status(500).json({
        success:false,
        message:error.message,
      })
    }
}

//signup controller//

exports.signUp = async(req,res)=>{
      try {
        //fetch data from req body//
        const {firstName,lastName,email,password,confirmPassword,accountType,contactNumber,otp} = req.body;
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"All feilds are required",
            })
        }
        //check if password and conformPassword are matching or not//
        if(password !== confirmPassword){
            return res.status(403).json({
                success:false,
                message:"Password and Confirm Password Value  Do not Match, Pls try Again later",
            })
        }
        //check if user Already exist or not//
        const existingUser = await User.find({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User Already Registered",
            });
        }

        //find most recent otp //
        const recentOtp = await User.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);
        //validate OTP//
        if(recentOtp.length == 0){
            return res.status(403).json({
                success:false,
                message:"OTP Not Found",
            })
        }else if(otp !== recentOtp.otp){
            return res.status(403).json({
                success:false,
                message:"Invalid OTP",
            })
        }
        
        //hashing the Password//
        const hashedPassword = await bcrypt.hash(password,10);
        //creating user in the Database//

        const ProfileDetails = await Profiler.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            contactNumber,
            accountType,
            additionalDetails:ProfileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg/seed=${firstName}${lastName}`,
        })
        //return response//
        return res.status(200).json({
            success:true,
            message:"user Created Succcessfully",
        })
      } catch (error) {
         console.log(error);
         return res.status(500).json({
            success:false,
            message:"User cannot be registred, Please try again later",
         })
      }
}