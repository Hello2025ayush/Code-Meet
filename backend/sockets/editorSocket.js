import Session from "../models/session.model.js";

export const editorSocket = (io) => {

    io.on("connection", (socket) => {
        console.log("USER IS NOW CONNECTED AT ::: ", socket.id);


        
        socket.on("joinSession", async ({sessionCode}) => {

            socket.join(sessionCode);                       // creates / joins a ROOM : code = arg.
            console.log(`${socket.id} has JOINED THE ROOM :: ${sessionCode}`);


            
            // when a new socket joins the room fetch existing code
            const sess = await Session.findOne({sessionCode});
            if(sess){
                const code = sess.code;
                socket.emit("loadCode", {code});
            }
            else{
                const code = "Nothing";
                socket.emit("loadCode", {code});
            }
        
        })
        

        socket.on("codeChange", async ({sessionCode, code}) => {

            // first save the code to db
            await Session.findOneAndUpdate({sessionCode}, {code});  // (find what, update what & to what)

            // send it to the sockets
            socket.to(sessionCode).emit("codeUpdate", {code});
 
        })

        

    });
}


 // NOTE --> .to send the emit to everyone in ROOM except the sender.. cause sender already has it hence avoiding loops
            // .on ==> recieving something ({event}, (data)=>{})
            // .emit ==> sending something (event, "hello")
