import Session from "../models/session.model.js"
import generateCode from "../utils/generateSessionCode.js";


const createSession = async (req, res) => {
    const field = req.body;


    const interviewerName =  field.interviewerName;
    const sessionCode = generateCode();
    const expiresAt = new Date(Date.now() + 60*60*1000);   // 1hr

    console.log("Somebody trying to create a Session ................. !!! #######");
    
    const session  = new Session({          // create instance of Schema
        interviewerName,
        sessionCode,
        expiresAt
    })

    try{
        await session.save();
        return res.status(200).json({message: "Session Created succesfully!!", session});
    }
    catch(error){
        console.log("ERROR in Creating Session: ", error.message);
        return res.status(500).json({message: "Session not created!!"});
    }
}

export default createSession;