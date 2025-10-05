const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
       email:{
        type:String,
        required:true,
       },
       otp:{
         type:String,
         required:true,
       },
       createdAt:{
         type:Date,
         default:Date.now(),
         expires: 5 * 60,
       }
});

//function to send verification email//
async function sendVerificationmail(email,otp){
      try {
        const mailResponse = await mailSender(email,"verification Email from StudyNotion",otp);
        console.log("Email Sent Successfully",mailResponse);
      } catch (error) {
        console.log("error occured while sending emails:", error);
        throw error;
      }
}

OTPSchema.pre("save", async function(next){
  await sendVerificationmail(this.email,this.otp);
  next();
})


exports.module = mongoose.model("OTP",OTPSchema);