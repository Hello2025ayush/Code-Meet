import mongoose from "mongoose";


const sessionSchema = new mongoose.Schema({
    sessionCode: {
        type: String,
        required: true,
        unique: true
    },

    interviewerName:{
        type: String,
        required: true
    },

    problemStatement:{
        type: String,
        default: ""
    },

    sampleTest: {
        type: String,
        default: ""
    },

    code:{                      // user coding part code
        type: String,
        default: ""
    },

    lanuage:{
        type: String,
        default: "cpp"
    },

    expiresAt: {
        type: Date,
        required: true
    }

}, {timestamps: true});


const Session = mongoose.model("Session", sessionSchema);


export default Session;