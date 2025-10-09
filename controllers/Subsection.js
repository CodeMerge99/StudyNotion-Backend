const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
require("dotenv").config();

//create Subsection controller//
exports.createSubSection = async(requestAnimationFrame,res)=>{
    try {
        //fetch data from req body//
        const{sectionId,title,timeDuration,description} = req.body;
        //extract video file//
        const video = req.file.videoFile;
        //validation//
        if(!sectionId || !title || !timeDuration || !description){
            return res.status(400).json({
                success:false,
                message:"All feilds are required",
            })
        }
        //uplaod video to cloudinary//
        const uploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        //create  subsection//
        const SubSectionDetails = await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url,
        })
        //update section with this Subsection ObjectId//
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},{
            
                $push:{
                    subSection:SubSectionDetails._id,
                },
                
        },{new:true})
        //return response//
        return res.status(200).json({
            success:true,
            message:"Sub Section Created Successfully",
            updatedSection,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:error.message,
        })
    }
}