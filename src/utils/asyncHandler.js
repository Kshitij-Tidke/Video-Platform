// PROMISE BASE APPROCH
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise
            .resolve(requestHandler(req, res, next))
            .catch((error) => next(error))
    }
    
}

export { asyncHandler }




// BELOW APPROACH IS ASYNC/AWAIT TRY CATCH APPROACH
// const asyncHandler = () => {}
// const asyncHandler = (fun) => {}
// const asyncHandler = (fn) => { () => {} }
// const asyncHandler = (fn) =>  () => {} feature we remove { }

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }

// export { asyncHandler }
