import { randomInt } from "crypto";
import { redisClient } from "../configs/redis.mjs";
const OTP_TILL_SECONDS=300
const OTP_DIIGITS=6
function generatenumberOTP(digits=OTP_DIIGITS){
  const min = 10 ** (digits - 1);
  const max = 10 ** digits - 1;
  return String(randomInt(min, max + 1));
}

export async function createandstoreOtp(userId){
  const otp=generatenumberOTP();
  const key=`verify:otp:${userId}`
  await redisClient.set(key,otp,{Ex: OTP_TILL_SECONDS})
  return otp;
}

export async function verifyandconsumeOtp(userId,submittedOtp){
  const key=`verify:otp:${userId}`
  const stored=await redisClient.get(key);
  if(!stored){
    return {
      success:false,
      message:"expired or missing"
    }
  }
  if(stored!=String(submittedOtp)) return{
    success:false,
    message:"You passed the wrong otp"
  }
  await redisClient.delete(key);
  return {
    success:true,
    message:"You are verified"
  }
}