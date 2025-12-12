import auth from "../../schemas/authschemas.mjs";
export const updateProfilePicture=async (req,res)=>{
  try{
    const userId=req.user.user._id;
    const {filePath}=req.body;
    if(!filePath || typeof filePath!=="string"){
      return res.status(400).json({
        success:false,
        message:"Invalid filepath"
      })
    }
    const user=await auth.findbyId(userId);
    if(!user){
      return res.status(400).json({
        success:false,
        message:"User not found"
      })
    }
    const oldPicture=user.profilePicture || null;
    user.profilePicture=filePath;
    await user.save();
    return res.status(200).json({
      success:true,
      message:"Profle picture has been updated successfully",
      data:{
        filePath,
        oldPicture
      }
    })
  }catch(err){
    console.log("Updated Profile Picture Error",err);
    return res.status(500).json({
      success:false,
      message:"Internal server error."
    })
  }
}