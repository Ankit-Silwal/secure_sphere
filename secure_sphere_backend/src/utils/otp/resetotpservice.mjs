import { randomInt } from "crypto";
import { redisClient } from "../../configs/redis.mjs";

const OTP_TILL_SECONDS = 300;
const OTP_DIGITS = 6;

function generatenumberOTP(digits = OTP_DIGITS) {
  const min = 10 ** (digits - 1);
  const max = 10 ** digits - 1;
  return String(randomInt(min, max + 1));
}

export async function createAndStoreResetOtp(userId) {
  const otp = generatenumberOTP();
  const key = `reset:otp:${userId}`;
  
  await redisClient.set(key, otp, { EX: OTP_TILL_SECONDS });
  console.log(`Reset OTP stored for ${userId}: expires in ${OTP_TILL_SECONDS}s`);
  
  return otp;
}

export async function verifyAndConsumeResetOtp(userId, otp) {
  const key = `reset:otp:${userId}`;
  const storedOtp = await redisClient.get(key);
  console.log(`Checking reset OTP for ${userId}: stored=${storedOtp}, submitted=${otp}`);

  if (!storedOtp) {
    console.log(`Reset OTP expired or missing for key: ${key}`);
    return { success: false, message: "expired or missing" };
  }

  if (storedOtp !== String(otp)) {
    return { success: false, message: "Invalid OTP" };
  }

  await redisClient.del(key);

  return { success: true, message: "OTP verified" };
}
