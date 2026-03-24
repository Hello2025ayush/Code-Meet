import mongoose from "mongoose";


const sessionSchema = new mongoose.Schema({
    sessionCode: {
        type: String,
        required: true,
        unique: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
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

    // Proper field name (preferred).
    language:{
        type: String,
        default: "cpp"
    },

    // Backwards compatibility: keep the old typo field.
    lanuage:{
        type: String,
        default: undefined
    },

    expiresAt: {
        type: Date,
        required: true
    }

}, {timestamps: true});

// Automatically remove expired sessions.
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


const Session = mongoose.model("Session", sessionSchema);


export default Session;
