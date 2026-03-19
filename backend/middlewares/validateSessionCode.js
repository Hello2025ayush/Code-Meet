export const validateSessionCode = (req, res, next) => {
    const sessionCode = req.body.sessionCode;

    if(!sessionCode){
        return res.status(400).json({
            success: false,
            message: "Session Code should be Present"
        })
    }

    next();
}