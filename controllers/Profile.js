const Profile = require("../models/Profile");
const User = require("../models/User");

//update Profile Controller//
exports.Updateprofile = async(req,res)=>{
    try {
        //fecth data from req body//
        const{dateOfBirth="",aboutDetails="",contactNumber,gender} = req.body;
        //get userid //
        const id = req.user.id;
        //validation//
        if(!contactNumber || !gender){
            return res.status(400).json({
                success:false,
                message:"All Feilds are required",
            })
        }
        //find profile//
        const userDetails = await User.findById(id);
        const profileId = await userDetails.aboutDetails;
        const profileDetails = await Profile.findById(profileId);
        //update profile//
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.aboutDetails = aboutDetails;
        profileDetails.contactNumber = contactNumber;
        profileDetails.gender = gender;
        //saving the updates//
        await profileDetails.save();
        //return response//
        return res.status(200).json({
            success:true,
            message:"Profile Updated Successfully",
            profileDetails,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Failed to Update the Profile, Pls try later",
            error:error.message,
        })
    }
}

//deleteAccount Controller//
exports.deleteAccount = async(req,res)=>{
    try {
        //fetch id//
        const id = req.user.id;
        //validation//
        const userDetails = await User.findById(id);
        //validation//
        if(!userDetails){
            return res.status(401).json({
                success:false,
                message:"User not Found",
            })
        }
        //delete Profile//
        await Profile.findByIdAndDelete({_id:userDetails.addtitionalDetails});
        //delete user//
        await User.findByIdAndDelete({_id:id});
        //return response//
        return res.status(200).json({
            success:true,
            message:"User deleted Successfully",
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to delete user, pls try later",
        })
    }
}

//getAllUserDetails Controller//
exports.getAllUserDetails = async(req,res)=>{
    try {
        //fetch id//
        const id = req.user.id;
        //validation and user details//
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        //return response//
        return res.status(200).json({
            success:true,
            message:"User Data Fetched Successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            messsage:"failed to fetch user Data, pls try again later",
        })
    }
}