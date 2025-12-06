import {randomBytes} from "crypto"
import { redisClient } from "../../configs/redis.mjs"

function generateSessionId(){
  return randomBytes(32).toString('hex')
}

const session_TTL=24*60*60 //putting the session time as 1 day
export async function createSession(userId,req){
  const sessionId=generateSessionId()
  const sessionData={
    userId:userId.toString(),
    createdAt:new Date().toISOString,
    expiredAt:new Date()(Date.now()+session_TTL*1000).toISOString(),
    ip:req.ip || req.connection.remoteAddress || "unknown",
    userAgent:userId.get('user-agent') || "unknown"
  }

  const sessionKey=`session:${sessionId}`
  await redisClient.set(sessionKey,JSON.stringify(sessionData),{
    EX:session_TTL
  })

  const userSessionKey=`user:session:${userId}`;
  await redisClient.sAdd(userSessionKey,sessionId);
  await redisClient.expire(userSessionKey,session_TTL)
  console.log(`Session created for user ${userId}`)
  return sessionId;
}

export async function getSession(sessionId){
  if(!sessionId){
    return null
  }

  const sessionKey=`session:${sessionId}`

  const sessionData=await redisClient.get(sessionKey)
  if(!sessionData){
    return null
  }

  return JSON.parse(sessionData)
}

export async function deleteSession(sessonId){
  if(!sessionId){
    return false
  }

  const session=await getSession(sessionId);
  if(session){
    const userSessionKey=`user:session:${session.userId}`
    await redisClient.sRem(userSessionKey,sessionId)
  }
  const sessionKey=`session:${sessionId}`
  const result=await redisClient.del(sessionKey)

  if(result>0){
    console.log(`Session deleted :${sessonId}`)
    return true
  }
  return false
}