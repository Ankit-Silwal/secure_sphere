import Activitylog from "../../schemas/activityLogsSchemas.mjs";

export const getUserActivity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const logs = await Activitylog
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);
    const formatted = logs.map(log => ({
      action: log.action,
      ip: log.ip || "Unknown",
      device: parseUserAgent(log.userAgent),
      timestamp: log.createdAt
    }));
    res.json({
      success: true,
      count: formatted.length,
      logs: formatted
    });
  } catch (error) {
    console.error("Error fetching user activity:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch activity",
      error: error.message
    });
  }
};

function parseUserAgent(ua) {
  if (!ua) return "Unknown Device";

  if (ua.includes("Windows")) return "Windows (Chrome)";
  if (ua.includes("Mac OS")) return "Mac (Safari)";
  if (ua.includes("Android")) return "Android Phone";
  if (ua.includes("iPhone") || ua.includes("iOS")) return "iPhone";

  return "Unknown Device";
}