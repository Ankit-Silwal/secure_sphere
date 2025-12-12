import User from "../../schemas/authschemas.mjs";
import { generatesignedurl } from "./generateSignedUrl.mjs";

export const getMe = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Generate signed download URL for profile picture
    let profilePictureUrl = null;
    if (user.profilePicture) {
      profilePictureUrl = await generatesignedurl(user.profilePicture);
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
        role: user.role,
        profilePicture: user.profilePicture,
        profilePictureUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (err) {
    console.error("getMe Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });
  }
};
