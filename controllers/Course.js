const Course = require("../models/Course");
const Tag = require("../models/tag");
const {imageUploadToCloudinary, uploadImageToCloudinary} = require("../utils/imageUploader");
require("dotenv").config();


//create CourseHandler//
exports.createCourse = async(req, res)=>{
    try {
        //fetch data//
        const{courseName,courseDescription,whatYouWillLearn,price,tag} = req.body;
        //get thumbnail image//
        const thumbnail = req.files.thumbnailImage;
        //validation//
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag){
            return res.status(400).json0({
                success:false,
                message:"All feilds are required",
            })
        }
        //check for instructor//
        const userId = req.user.id;
        const InstructorDetails = await User.find(userId);
        console.log(' Instructor Details:', InstructorDetails);
        //validation//
        if(!InstructorDetails){
            return res.status(404).json({
                success:false,
                message:"Instructor Details Not Found",
            })
        }
        //check if given tag is valid or not//
        const tagDetails = await Tag.findById(tag);
        if(!tagDetails){
            return res.status(404).json({
                success:false,
                message:"Tag Details Not Found",
            })
        }
        //uploading image to cloudinary //
        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);
        //create an entry for a new Course//
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: InstructorDetails._id,
            whatYouWillLearn:whatYouWillLearn,
            price,
            tag:tagDetails._id,
            thumbnail:thumbnailImage.secure_url,
        })
        //adding the new course to the user Schema of the instructor//
        await User.findByIdAndUpdate({_id:InstructorDetails._id},{$push:{courses:newCourse._id}},{new:true})
        //update TAG SCHEMA is homework//

        //return response//
        return res.status(200).json({
            success:true,
            message:"Course Created Successfully",
            data:newCourse
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to create Course",
            error:error.message,
        })
    }
}

//getAllCourses Controller//
exports.showAllCourses = async(req,res) =>{
    try {
        //fecth data for all courses//
        const allCourses = await Course.find({},{
            courseName:true,
            price:true,
            thumbnail:true,
            instructor:true,
            ratingAndReviews:true,
            studentsEnrolled:true,
        }).populate("instructor").exec()

        //return response//
        return res.status(200).json({
            success:true,
            message:"Data for All Courses Fetched Successfully",
            data:allCourses,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"failed to fetch Course Details",
            error:error.message
        })
    }
}