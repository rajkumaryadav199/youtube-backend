import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser =asyncHandler( async(req, res)=>{
    /* get details from frontend */
    const {username, fullName, email, password} = req.body;
    /* Validation of proper data not empty */
    if([username,fullName,email, password].some((field)=>field?.trim()===''))
    {
        throw new ApiError(400, "All Fields are required");
    }
    /* check existance of users */
    const existedUser =User.findOne({
        $or:[{username},{email}]
    } )
    if(existedUser){
        throw new ApiError(409, "User with email or username is already exist");
    }
    /*check for image is prsent or not */
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar image is required")
    }
    /* upload them to cloudinary */
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if(!avatar){
        throw new ApiError(400, "Avatar image is required")
    }
    /* creat user object -create entry in db */
    const user = await User.create({
        username: username.toLowerCase(),
        password,
        fullName,
        email,
        avatar:avatar.url,
        coverImage: coverImage?.url || ''
    });
    /* in response remove password  and refresh token*/
    const createdUser =await User.findById(user._id).select("-password -refreshToken")
    /* check user creation*/
    if(!createUser){
        throw new ApiError(500, 'Server error in creating user')
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )
    

// })

    
res.status(200).json({
    message:'ok'
})
})

export { registerUser }