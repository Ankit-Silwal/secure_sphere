import auth from "../../schemas/authschemas.mjs";
import { deleteFile } from "./generateSignedUrl.mjs";
import { logActivity } from "../../logs/logActivity.mjs";
import { redisClient } from "../../configs/redis.mjs";

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { filePath, fileSize, fileType } = req.body;

    // Validation
    if (!filePath || typeof filePath !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid filepath"
      });
    }

    // Validate file type
    if (fileType && !ALLOWED_TYPES.has(fileType.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Only JPEG, PNG, and WebP images are allowed"
      });
    }

    // Validate file size
    if (fileSize && fileSize > MAX_FILE_SIZE) {
      return res.status(400).json({
        success: false,
        message: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`
      });
    }

    // Rate limiting - max 5 updates per hour
    const rateLimitKey = `profile-pic-update:${userId}`;
    const updateCount = await redisClient.incr(rateLimitKey);
    
    if (updateCount === 1) {
      await redisClient.expire(rateLimitKey, 3600); // 1 hour
    }
    
    if (updateCount > 5) {
      return res.status(429).json({
        success: false,
        message: "Too many profile picture updates. Please try again later."
      });
    }

    const user = await auth.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const oldPicture = user.profilePicture || null;

    // Delete old picture from Supabase
    if (oldPicture) {
      await deleteFile(oldPicture);
      await logActivity(userId, "OLD_PROFILE_PICTURE_DELETED", req);
    }

    // Save new picture path
    user.profilePicture = filePath;
    await user.save();

    await logActivity(userId, "PROFILE_PICTURE_UPDATED", req);

    return res.status(200).json({
      success: true,
      message: "Profile picture has been updated successfully",
      data: {
        filePath,
        oldPicture
      }
    });
  } catch (err) {
    console.error("Updated Profile Picture Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });
  }
}