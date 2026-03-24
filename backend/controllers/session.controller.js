import Session from "../models/session.model.js"
import generateCode from "../utils/generateSessionCode.js";

// CREATE SESSION
export const createSession = async (req, res) => {
    const interviewerName = req.user?.name || req.body?.interviewerName;
    const createdBy = req.user?.userId;
    if(!interviewerName){
        return res.status(400).json({
            success: false,
            message: "Interviewer Name is Required"
        });
    }
    if(!createdBy){
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }
    const expiresAt = new Date(Date.now() + 60*60*1000);   // 1hr


    // collision free session code..
    let exist = true;
    let sessionCode = generateCode();
    while(exist){
        const query = await Session.findOne({sessionCode});        // don't forget await   
        if(!query) exist = false;
        else sessionCode = generateCode();
    }

    

    console.log("Somebody trying to create a Session ................. !!! #######");
    
    const session  = new Session({          // create instance of Schema
        interviewerName,
        sessionCode,
        createdBy,
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



// JOIN SESSION

export const joinSession = async (req, res) => {
    const sessionCode = req.body.sessionCode;

    const session = await Session.findOne({sessionCode});     // use await for asynchronous.

    if(!session){
        return res.status(404).json({
            success: false,
            message: "Session Code not found !!"
        })
    }

    if(session.expiresAt < new Date()){
        return res.status(404).json({
            success: false,
            message: "Session is Expired"
        })
    }

    res.json({success: true, session});                     // send session details to client

}

// export default {createSession, joinSession};        // import xyz from "here" and then
                                                    // you have to use it as -- xyz.createSession()
                                                    // better option is directly export function...
