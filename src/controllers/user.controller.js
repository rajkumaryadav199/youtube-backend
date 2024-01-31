import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefereshTokens = async(userId)=>{
    try {
        const user = await User.findById(userId);
        const accessToken =user.generateAccessToken();
        const refreshToken =user.generateRefreshToken();

        user.refereshToken = refreshToken;
        await user.save({validateBeforSave:false});

        return {accessToken, refreshToken} 
    } catch (error) {
        throw new ApiError(500, "Some things went wrong while generating access tokens")
    }
}

const registerUser = asyncHandler( async(req, res)=>{
    /* get details from frontend */
    const {username, fullName, email, password} = req.body;
    /* Validation of proper data not empty */
    if([username,fullName,email, password].some((field)=>field?.trim()===''))
    {
        throw new ApiError(400, "All Fields are required");
    }
    /* check existance of users */
    const existedUser =await User.findOne({
        $or:[{username},{email}]
    } )
    if(existedUser){
        throw new ApiError(409, "User with email or username is already exist");
    }
    /*check for image is prsent or not */
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar image path is required is required")
    }
    /* upload them to cloudinary */
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    console.log(avatarLocalPath, coverImageLocalPath,coverImage,!avatar)
    if(!avatar){
        throw new ApiError(400, "Avatar image is required")
    }
    /* create user object -create entry in db */
    const user = await User.create({
        username: username.toLowerCase(),
        password,
        fullName,
        email,
        avatar:avatar.url,
        coverImage: coverImage?.url || ''
    });
    /* in response remove password  and refresh token*/
     const createdUser = await User.findById(user._id).select("-password -refreshToken")
    /* check user creation*/
    if(!createdUser){
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

const userLogin = asyncHandler(async(req, res)=>{
    /*req.body data is present or not*/
    const {email, username, password } =req.body;
    /*email || username  or password present */
    console.log("data", email, username, password)
    if(!(email || username))
    {
        throw new ApiError(400,"Email or username is required")
    }
    /*check user exist or not*/
    const user = await User.findOne({
        $or:[{email}, {username}]
    });
    if(!user)
    {
        throw new ApiError(404, "User Dose not exist")
    }
    /*check correct password */
    const isPasswordValied = await user.isPasswordCorrect(password);

    if(!isPasswordValied)
    {
        throw new ApiError(401, "Password is incorrect")
    }
    /*now generate tokens*/
    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id);

    const loggedInUser =await User.findById(user._id).select("-password -refreshToken");

    /* Send cookies*/
    const options ={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, {
            user:loggedInUser,accessToken, refreshToken
        },
        "User Logged In successfully")
    )
})

const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new:true
        }
        )

        const options ={
            httpOnly:true,
            secure:true
        }

        return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiError(200, {}, "User logged Out"))
})

export { registerUser, userLogin, logoutUser }