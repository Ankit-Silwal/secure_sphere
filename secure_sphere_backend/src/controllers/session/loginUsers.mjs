import auth from "../../schemas/authschemas.mjs";
import bcrypt from "bcrypt"
import { createSession } from "../../utils/session/sessionManager.mjs";
import { logActivity } from "../../logs/logActivity.mjs";
 
export const loginUser=async (req,res)=>{
  const {email,password}=req.body;
  if(!email || !password ){
    return res.status(400).json({
      success:false,
      message:"Both Email and Password are required"
    })
  }
  const user=await auth.findOne({email})
  if(!user){
    return res.status(404).json({
      success:false,
      message:"User not found please register first"
    })
  }

  if(!user.isVerified){
    return res.status(403).json({
      success:false,
      message:"Please verify this user"
    })
  }

  const isMatch=await bcrypt.compare(password,user.password)

  if(!isMatch){
    return res.status(401).json({
      success:false,
      message:"The password is incorrect"
    })
  }
  const sessionId=await createSession(user._id,req)
  res.cookie('sessionId',sessionId,{
    httpOnly:true,
    secure:process.env.NODE_ENV==="production",
    sameSite:"strict",
    maxAge:24*60*60*1000
  })
  await logActivity(user._id, "USER_LOGIN", req);
  
  return res.status(200).json({
    success:true,
    message:"Login successful",
    user:{
      username:user.username,
      email:user.email
    }
  })
}