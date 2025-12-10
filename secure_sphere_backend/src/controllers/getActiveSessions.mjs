import { getUserSessions, getSession } from "../utils/session/sessionManager.mjs";
export const getActiveSessions = async (req, res) => {
  try {
    const sessionId = req.cookies.sessionId;
    
    if (!sessionId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated"
      });
    }

    const session = await getSession(sessionId);
    
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired session"
      });
    }

    const userId = session.userId;
    const currentSessionId = req.cookies.sessionId;
    const sessions = await getUserSessions(userId);

    if (sessions.length === 0) {
      return res.json({
        success: true,
        message: "No active sessions found",
        sessions: []
      });
    }
    const formatted = sessions.map((s) => ({
      ...s,
      isCurrent: s.sessionId === currentSessionId
    }));
    formatted.sort((a, b) => {
      if (a.isCurrent && !b.isCurrent) return -1;
      if (!a.isCurrent && b.isCurrent) return 1;

      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    return res.json({
      success: true,
      totalSessions: formatted.length,
      sessions: formatted
    });
  } catch (err) {
    console.error("Error in getActiveSessions:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch active sessions"
    });
  }
};
