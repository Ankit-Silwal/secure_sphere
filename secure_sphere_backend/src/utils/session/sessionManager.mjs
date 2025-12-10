import {randomBytes} from "crypto"
import { redisClient } from "../../configs/redis.mjs"

function generateSessionId(){
  return randomBytes(32).toString('hex')
}

const SESSION_TTL=24*60*60
export async function extendSession(sessionId){
  if(!sessionId){
    return false;
  }
  const session=await getSession(sessionId);
  if(!session){
    return false;
  }
  const now=Date.now();
  const expiresAt=new Date(session.expiresAt).getTime();
  const timeUntilExpiry=expiresAt-now;
  const one_Hour=60*60*1000;
  if(timeUntilExpiry>one_Hour){
    return false;
  }
  const newExpiresAt=new Date(now+SESSION_TTL*1000).toISOString()
  session.expiresAt=newExpiresAt
  const sessionKey=`session:${sessionId}`
  await redisClient.set(sessionKey, JSON.stringify(session), { EX: SESSION_TTL });
  console.log(`Session been extended for user ${session.userId}`);
  return true;
}

export async function createSession(userId,req){
  const sessionId=generateSessionId()
  const sessionData={
    userId:userId.toString(),
    createdAt:new Date().toISOString(),
    expiresAt:new Date(Date.now()+SESSION_TTL*1000).toISOString(),
    ip:req.ip || req.connection.remoteAddress || "unknown",
    userAgent:req.get('user-agent') || "unknown"
  }

  const sessionKey=`session:${sessionId}`
  await redisClient.set(sessionKey,JSON.stringify(sessionData),{
    EX:SESSION_TTL
  })

  const userSessionKey=`user:sessions:${userId}`;
  await redisClient.sAdd(userSessionKey,sessionId);
  await redisClient.expire(userSessionKey,SESSION_TTL)
  console.log(`Session created for user ${userId}`)
  return sessionId;
}

export async function getUserSessions(userId) {
  if (!userId) return [];

  const userSessionsKey = `user:sessions:${userId}`;
  const sessionIds = await redisClient.sMembers(userSessionsKey);

  if (!sessionIds || sessionIds.length === 0) {
    return [];
  }

  const rawSessions = await Promise.all(
    sessionIds.map((id) => redisClient.get(`session:${id}`))
  );

  const results = [];
  for (let i = 0; i < sessionIds.length; i++) {
    const raw = rawSessions[i];

    if (!raw) {
      await redisClient.sRem(userSessionsKey, sessionIds[i]);
      continue;
    }

    const parsed = JSON.parse(raw);

    results.push({
      sessionId: sessionIds[i],
      userId: parsed.userId,
      ip: parsed.ip,
      userAgent: parsed.userAgent,
      createdAt: parsed.createdAt,
      expiresAt: parsed.expiresAt
    });
  }

  return results;
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

export async function deleteSession(sessionId){
  if(!sessionId){
    return false
  }

  const session=await getSession(sessionId);
  if(session){
    const userSessionKey=`user:sessions:${session.userId}`
    await redisClient.sRem(userSessionKey,sessionId)
  }
  const sessionKey=`session:${sessionId}`
  const result=await redisClient.del(sessionKey)

  if(result>0){
    console.log(`Session deleted :${sessionId}`)
    return true
  }
  return false
}

export async function deleteAllUserSessions(userId) {
  const userSessionsKey = `user:sessions:${userId}`;

  const sessionIds = await redisClient.sMembers(userSessionsKey);

  if (!sessionIds || sessionIds.length === 0) {
    return 0;
  }
  let deletedCount = 0;
  for (const sessionId of sessionIds) {
    const sessionKey = `session:${sessionId}`;
    const result = await redisClient.del(sessionKey);
    if (result > 0) {
      deletedCount++;
    }
  }
  await redisClient.del(userSessionsKey);

  console.log(`Deleted ${deletedCount} sessions for user ${userId}`);
  return deletedCount;
}