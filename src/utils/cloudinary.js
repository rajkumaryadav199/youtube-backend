import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUDE_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async(localFilePath)=>{
try {
    if(!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
    resource_type: "auto"})
    // console.log("file is uploaded on cloudanary", response.url)
    fs.unlinkSync(localFilePath)
  return response;
} catch (error) {
  /* Remove the localy uploaded file as the uploades file get failed*/
  fs.unlinkSync(localFilePath)
  return null;
}
}

export { uploadOnCloudinary }