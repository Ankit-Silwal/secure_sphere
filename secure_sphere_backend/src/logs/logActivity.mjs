import Activitylog from "../schemas/activityLogsSchemas.mjs";
export async function logActivity(userId, action, req) {
  try {
    await Activitylog.create({
      userId,
      action,
      ip: req.ip || req.connection?.remoteAddress || "unknown",
      userAgent: req.headers["user-agent"] || "unknown"
    });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
}