export const createSessionValidate = (req, res, next) => {
    // interviewerName is taken from JWT (req.user) in the controller.
    next();
}