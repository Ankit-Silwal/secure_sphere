import { createClient } from "redis";
const REDIS_URL=process.env.REDIS_URL
const redisClient=createClient({
  url:REDIS_URL
})
redisClient.on("error",(err)=>{
  console.log(err)
})
redisClient.on("ready",()=>{
  console.log("The redis is ready")
})
export async function initRedis(){
  if(!redisClient.isOpen){
    await redisClient.connect();
  }
}
export {redisClient}