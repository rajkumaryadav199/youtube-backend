/* Method 1
Higher order function using handling promise using Promise key word*/

const asyncHandler = (requestHandler) =>{
    return (req, res, next)=>{
        Promise.resolve(requestHandler(req, res, next))
        .catch((err)=>next(err))
    }
};
export { asyncHandler };



/* Method 2
Higher order function using handling promise using async await try and catch*/
// const asyncHandler= (func) = async(req, res, next)=>{
//     try {
//         await func(req, res, next)
//     } catch (err) {
//         res.status(err.code || 500).json({
//             success: false,
//             message:err.message
//         })
//     }

// }