const Tag = require("../models/tag");

//create Tag controller

exports.createTag = async(req,res)=>{
    try {
        //fetch data from req body//
    const {name,description} = req.body;
    //validation//
    if(!name || !description){
        return res.status(401).json({
            success:false,
            message:"All feilds are missing",
        })
    }
    //create tag entry in DB//
    const tagDetails = await Tag.create({
        name:name,
        description:description,
    })
    console.log(tagDetails);
    //return response//
    return res.status(200).json({
        success:true,
        message:"Tag Created Successfully",
    })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//getAlltags controller//
exports.showAlltags = async(req,res)=>{
    try {
        const allTags = await Tag.find({},{name:true,description:true});
        //return response//
        return res.status(200).json({
            success:true,
            message:"All Tags returned successfully",
        })
    } catch (error) {
        
    }
}