import { supabase } from "../../configs/supabase.mjs";

export const generatesignedurl = async (filePath) => {
  try {
    if (!filePath) {
      return null;
    }
    
    const bucketName = process.env.SUPABASE_BUCKET;
    const cleanPath = filePath.replace(`${bucketName}/`, "");
    
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .createSignedUrl(cleanPath, 3600); // 1 hour expiry
    
    if (error) {
      console.error("Signed URL error:", error);
      return null;
    }
    
    return data.signedUrl;
  } catch (err) {
    console.error("Generate signed URL error:", err);
    return null;
  }
}

export const deleteFile = async (filePath) => {
  try {
    if (!filePath) {
      return false;
    }
    
    const bucketName = process.env.SUPABASE_BUCKET;
    const cleanPath = filePath.replace(`${bucketName}/`, "");
    
    const { error } = await supabase
      .storage
      .from(bucketName)
      .remove([cleanPath]);
    
    if (error) {
      console.error("Delete file error:", error);
      return false;
    }
    
    console.log(`Deleted old profile picture: ${cleanPath}`);
    return true;
  } catch (err) {
    console.error("Delete file error:", err);
    return false;
  }
}