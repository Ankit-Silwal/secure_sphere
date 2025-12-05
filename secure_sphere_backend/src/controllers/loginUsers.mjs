import auth from "../schemas/authschemas.mjs";
import bcrypt from "bcrypt"
 
export const loginUser=async (req,res)=>{
  const {email,password}=req.body;
  if(!email || !password ){
    return res.status(400).json({
      success:false,
      msg:"Both Email and Password are required"
    })
  }
  const user=await auth.findOne({email})
  if(!user){
    return res.status(404).json({
      success:false,
      msg:"User not found please register first"
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
      msg:"The password is incorrect"
    })
  }

  return res.status(200).json({
    success:true,
    message:"Login successful",
    user:{
      username:user.username,
      email:user.email
    }
  })
}