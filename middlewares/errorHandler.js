export const errorHandler = (err, req, res, next) => {
    console.log(err);

    return res.status(500).json({
        success: false,
        message: "Internal Server Error !!"
    })
}

// always used at bottom to catch all errors..
// identified by their 4 parameters