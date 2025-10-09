const Section = require("../models/Section");
const Course = require("../models/Course");

//create Section Controller//
exports.createSection = async(req,res)=>{
    try {
        //fetch data//
        const {sectionName,courseId} = req.body;
        //validation//
        if(!sectionName , !courseId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties",
            })
        }
        //create newsection //
        const newSection = await Section.create({sectionName});
        //update course with section objectId//
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push:{
                    courseContent:newSection._id,
                }
            },
            {
                new:true,
            }
        )
        //return response//
        return res.status(200).json({
            success:true,
            message:"Section Created Successfully",
            updatedCourseDetails,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to Create newSection, pls try again later",
            error:error.message,
        })
    }
}


//updaet Section Controller//
exports.updateSection = async(req,res)=>{
    try {
        //fetch data from req body//
        const {sectionName,sectionId} = req.body;
        //validation//
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties",
            })
        }
        //update data//
        const section = await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});
        //return res//
        return res.status(200).json({
            success:true,
            message:"Section Updated Successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to update Section, pls try again later"
        })
    }
}

//delete Section Controller//
exports.deleteSection = async(req,res)=>{
    try {
        //fetch SectionId to delete assuming the id is passed in url , so lets use params//
        const {sectionId} = req.params;
        await Section.findByIdAndDelete(sectionId);
        //return res//
        return res.status(200).json({
            success:true,
            message:"Section deleted Successfully",
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to Delete the Section At the Moment, pls try later",
        })
    }
}