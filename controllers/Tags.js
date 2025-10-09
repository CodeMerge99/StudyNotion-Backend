const Tag = require("../models/tag");

//create Tag controller

exports.createCategory = async(req,res)=>{
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
    const newCategory = await Tag.create({
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
exports.showAllCategories = async(req,res)=>{
    try {
        const allCategories = await Tag.find({},{name:true,description:true});
        //return response//
        return res.status(200).json({
            success:true,
            message:"All Tags returned successfully",
        })
    } catch (error) {
        
    }
}