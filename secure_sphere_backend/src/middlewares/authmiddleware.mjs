import { getSession, extendSession } from '../utils/session/sessionManager.mjs';

export const authMiddleware = async (req, res, next) => {
  const sessionId = req.cookies.sessionId;
  if (!sessionId) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated. Please login."
    });
  }
  const session = await getSession(sessionId);
  if (!session) {
    return res.status(401).json({
      success: false,
      message: "Session expired or invalid. Please login again."
    });
  }
  
  extendSession(sessionId).catch(err => {
    console.error('Error extending session:', err);
  });
  
  req.user = {
    userId: session.userId
  };
  
  next();
};