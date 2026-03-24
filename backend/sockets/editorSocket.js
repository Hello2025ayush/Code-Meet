import Session from "../models/session.model.js";

// Debounce DB writes per session+field to avoid hammering Mongo on every keystroke.
const dbSaveTimers = new Map();
const allowedLanguages = new Set(["cpp", "python", "java"]);

const scheduleSave = (sessionCode, field, value) => {
    const key = `${sessionCode}:${field}`;

    if(dbSaveTimers.has(key)){
        clearTimeout(dbSaveTimers.get(key));
    }

    const timer = setTimeout(async () => {
        try{
            await Session.findOneAndUpdate(
                { sessionCode },
                { [field]: value }
            );
        }
        catch(error){
            console.log("DB save failed:", error.message);
        }
        finally{
            dbSaveTimers.delete(key);
        }
    }, 250);

    dbSaveTimers.set(key, timer);
};

export const editorSocket = (io) => {

    io.on("connection", (socket) => {
        console.log("USER IS NOW CONNECTED AT ::: ", socket.id);


        
        socket.on("joinSession", async ({sessionCode}) => {

            socket.join(sessionCode);                       // creates / joins a ROOM : code = arg.
            console.log(`${socket.id} has JOINED THE ROOM :: ${sessionCode}`);


            
            // when a new socket joins the room fetch existing full state
            const sess = await Session.findOne({sessionCode});
            if(!sess){
                socket.emit("loadSessionState", {
                    sessionCode,
                    interviewerName: "",
                    createdBy: null,
                    problemStatement: "",
                    sampleTest: "",
                    code: "",
                    language: "cpp",
                });
                socket.emit("loadCode", {code: ""}); // backwards compatibility
                return;
            }
            if(sess.expiresAt < new Date()){
                socket.emit("loadSessionState", {
                    sessionCode,
                    interviewerName: "",
                    createdBy: null,
                    problemStatement: "",
                    sampleTest: "",
                    code: "",
                    language: "cpp",
                });
                return;
            }

            const language = sess.language || sess.lanuage || "cpp";
            socket.emit("loadSessionState", {
                sessionCode,
                interviewerName: sess.interviewerName || "",
                createdBy: sess.createdBy?.toString?.() || null,
                problemStatement: sess.problemStatement || "",
                sampleTest: sess.sampleTest || "",
                code: sess.code || "",
                language,
            });

            // Backwards compatibility: older clients only expect code.
            socket.emit("loadCode", {code: sess.code || ""});
        
        })
        

        socket.on("codeChange", ({sessionCode, code}) => {
            // Send it to the other sockets immediately.
            socket.to(sessionCode).emit("codeUpdate", {code});

            // Then debounce saving to Mongo.
            scheduleSave(sessionCode, "code", code);
 
        })

        socket.on("problemStatementChange", ({sessionCode, problemStatement}) => {
            socket.to(sessionCode).emit("problemStatementUpdate", {problemStatement});
            scheduleSave(sessionCode, "problemStatement", problemStatement);
        })

        socket.on("sampleTestChange", ({sessionCode, sampleTest}) => {
            socket.to(sessionCode).emit("sampleTestUpdate", {sampleTest});
            scheduleSave(sessionCode, "sampleTest", sampleTest);
        })

        socket.on("languageChange", ({sessionCode, language, code}) => {
            const nextLanguage = allowedLanguages.has(language) ? language : "cpp";
            socket.to(sessionCode).emit("languageUpdate", {language: nextLanguage, code: code || ""});
            scheduleSave(sessionCode, "language", nextLanguage);
            scheduleSave(sessionCode, "code", code || "");
        })

        

    });
}


 // NOTE --> .to send the emit to everyone in ROOM except the sender.. cause sender already has it hence avoiding loops
            // .on ==> recieving something ({event}, (data)=>{})
            // .emit ==> sending something (event, "hello")
