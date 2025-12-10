import { deleteAllUserSessions, getSession } from "../../utils/session/sessionManager.mjs";
import { logActivity } from "../../logs/logActivity.mjs";

export const deleteAllSessions = async (req, res) => {
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
    
    const deletedCount = await deleteAllUserSessions(userId);
    await logActivity(userId, "ALL_SESSIONS_DELETED", req);

    res.clearCookie('sessionId');

    return res.json({
      success: true,
      message: `Successfully deleted ${deletedCount} session(s)`,
      deletedCount
    });
  } catch (err) {
    console.error("Error in deleteAllSessions:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete sessions"
    });
  }
};
