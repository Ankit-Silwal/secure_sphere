import { supabase } from "../../configs/supabase.mjs";
import crypto from "crypto";

export const generateUploadUrl = async (req, res) => {
  try {
    const userId = req.user.userId;
    const fileName = `${userId}_${crypto.randomUUID()}.jpg`;
    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .createSignedUploadUrl(fileName, 60);
    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
    return res.json({
      success: true,
      uploadUrl: data.signedUrl,
      filePath: fileName
    });

  } catch (err) {
    console.error("Upload URL error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
