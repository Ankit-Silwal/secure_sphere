import mongoose from "mongoose";
import bcrypt from "bcrypt"
const authSchemas = mongoose.Schema(
  {
    isVerified:{
      type:Boolean,
      required:false,
      default:false
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique:true
    },
    password: {
      type: String,
      required: true,
    },

    profilePicture: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true,
  }
);
authSchemas.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
});
authSchemas.method.comparePassword=async function (enteredPassword){
  return bcrypt.compare(enteredPassword,this.password)
}


const auth=mongoose.model("auth",authSchemas)
export default auth