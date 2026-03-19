import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import sessionRouter from "./routes/session.router.js";            
import { errorHandler } from "./middlewares/errorHandler.js";
import { editorSocket } from "./sockets/editorSocket.js";  



// SOCKET IO 
import http from "http";
import { Server } from "socket.io";
import { log } from "console";
 
dotenv.config({ path: "./backend/.env" });
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin: "*"
    }
});              // instance of socket.io



// System config..
app.use(express.json());                  // converting OR Parsing json into js object
editorSocket(io);

// Manual config..
const PORT = process.env.PORT || 2000;
connectDB();


app.use("/session", sessionRouter);



server.listen(PORT, () => {                                    // .listen starts the server.. ("server" not "app" cause http is the one handling now)
    console.log(`Server is running on PORT: ${PORT}`);      
})
 

app.use(errorHandler);