export const createSessionValidate = (req, res, next) => {
    const {interviewerName} = req.body;

    if(!interviewerName){
        return res.status(400).json({
            success: false,
            message: "Interviewer Name is Required !!"
        })
    }

    next();
}