import mongoose from "mongoose";
const authSchemas = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: user,
    },
  },
  {
    timestamps: true,
  }
);
export default authSchemas