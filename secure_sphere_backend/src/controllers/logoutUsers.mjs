import { deleteSession, getSession } from "../utils/session/sessionManager.mjs";
import { logActivity } from "../logs/logActivity.mjs";
export const logoutUser=async (req,res)=>{
  try{
    const sessionId=req.cookies.sessionId;
    if(sessionId){
      const session = await getSession(sessionId);
      if(session){
        await logActivity(session.userId, "USER_LOGOUT", req);
      }
      await deleteSession(sessionId)
    }
    res.clearCookie('sessionId',{
      httpOnly:true,
      secure:process.env.NODE_ENV==="production",
      sameSite:"strict"
    })
    res.json({
      success:true,
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