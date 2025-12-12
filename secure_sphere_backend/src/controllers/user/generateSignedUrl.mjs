// import { createClient } from "@supabase/supabase-js";
import { supabase } from "../../configs/supabase.mjs";
export const generatesignedurl=async (filePath)=>{
  try{
      if(!filePath){
        return null;
      }
  const bucketName=process.env.SUPABASE_BUCKET;
  const {data,error}=await supabase
      .storage
      .from(bucketName)
      .createSignedUrl(filePath.replace(`${bucketName}/`,""),60);
  if(error){
    console.log("Signed Url error",error)
    return null;
  }
  return data.signedUrl;
  }catch(err){
    console.log("An error occured in the given process",err);
  }
}