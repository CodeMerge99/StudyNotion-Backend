const mongoose = require("mongoose");
require("dotenv").config();

exports.connect =()=>{
    mongoose.connect(process.env.MONGODB_URL)
   .then(()=> console.log("Database Connection Successfull"))
    .error((error)=>{
        console.log("Error Conecting to the Database");
        console.error(error);
        process.exit(1);
    })
}