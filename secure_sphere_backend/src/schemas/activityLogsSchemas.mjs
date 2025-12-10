import mongoose, { Mongoose } from "mongoose";
const activitySchemas=new mongoose.Schema(
  {
    userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true,
    },
    action:{
      type:String,
      required:true,
    },
    ip:String,
    userAgent:String,
  },
  {
    timestamps:true
  }
)
export default mongoose.model("Activitylog",activitySchemas);