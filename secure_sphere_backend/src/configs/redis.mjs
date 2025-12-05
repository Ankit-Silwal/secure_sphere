import { createClient } from "redis";
const REDIS_URL=process.env.REDIS_URL
const redisClient=createClient({
  url:REDIS_URL
})
redisClient.on("error",(err)=>{
  console.log("Redis connection error:",err.message)
})
redisClient.on("ready",()=>{
  console.log("✓ Redis is ready")
})
export async function initRedis(){
  try {
    if(!redisClient.isOpen){
      await redisClient.connect();
    }
  } catch (error) {
    console.log("⚠️  Warning: Could not connect to Redis");
    console.log("   OTP features will not work until Redis is running");
  }
}
export {redisClient}