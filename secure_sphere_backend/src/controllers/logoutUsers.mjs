import { deleteSession } from "../utils/session/sessionManager.mjs";
export const logoutUser=async (req,res)=>{
  try{
    const sessionId=req.cookie.sessionId;
    if(sessionId){
      await deleteSession(sessionId)
    }
    res.Clearcookie('sessionId',{
      http:true,
      secure:process.env.NODE_ENV==="production",
      sameSite:"strict"
    })
    res.json({
      sucess:true,
      message:"logout successfully"
    })
  }catch(err){
    res.json({
      success:false,
      message:"An error occured",
      error:err.message
    })
  }
}