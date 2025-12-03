import auth from "../schemas/authschemas.mjs";
import { verifyandconsumeOtp } from "../utils/otpgenerator.mjs";

export const verifyEmail=async (req,res)=>{
  const {email,otp}=req.body;
  if(!email || !otp){
    response.status(400).json({
      success:false,
      message:"Both the email and otp are required"
    })
  }

  const user=await auth.findOne({email})
  if(!user){
    return res.status(404).json({
      success:false,
      message:"That user doesnt exists"
    })
  }

  if(user.isVerified){
    return res.status(404).json({
      success:false,
      message:"The user is already verified"
    })
  }

  const result=await verifyandconsumeOtp(user._id.toString(),otp);
  if(!result.success){
    return res.json({
      success:false,
      message:
        res.message==="expired or missing"?"OTP has been expired or doesnt exists":"Invalid OTP"
    })
  }

  user.isVerified=true;
  await user.save()
  return res.status(400).json({
    success:true,
    message:"You been loggin succesfully"
  })
}
