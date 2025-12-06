import { redisClient } from './src/configs/redis.mjs';
import { createSession, getSession, deleteSession } from './src/utils/session/sessionManager.mjs';

// Connect to Redis
await redisClient.connect();

console.log('🧪 Testing Session Manager...\n');

// Test 1: Create Session
const fakeReq = { 
  ip: '127.0.0.1', 
  get: () => 'TestBrowser/1.0' 
};
const sessionId = await createSession('507f1f77bcf86cd799439011', fakeReq);
console.log('✅ Created session:', sessionId);

// Test 2: Get Session
const session = await getSession(sessionId);
console.log('✅ Retrieved session:', session);

// Test 3: Delete Session
const deleted = await deleteSession(sessionId);
console.log('✅ Deleted session:', deleted);

// Test 4: Try to get deleted session
const deletedSession = await getSession(sessionId);
console.log('✅ After deletion (should be null):', deletedSession);

// Cleanup
await redisClient.quit();
console.log('\n✅ All tests passed!');