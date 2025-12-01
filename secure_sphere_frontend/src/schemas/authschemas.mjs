import mongoose from "mongoose";
import bcrypt from "bcrypt"
const authSchemas = mongoose.Schema(
  {
    isverified:{
      type:Boolean,
      required:false
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
    role: {
      type: String,
      enum: ["admin", "user"],
      default:"user",
    },
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