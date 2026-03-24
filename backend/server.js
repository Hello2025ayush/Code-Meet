import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import sessionRouter from "./routes/session.router.js";            
import { errorHandler } from "./middlewares/errorHandler.js";
import { editorSocket } from "./sockets/editorSocket.js";  



// SOCKET IO 
import http from "http";
import { Server } from "socket.io";
 
dotenv.config({ path: "./backend/.env" });
const { default: authRouter } = await import("./routes/auth.router.js");
const { authSocket } = await import("./middlewares/authSocket.js");
const frontendOrigin = process.env.FRONTEND_ORIGIN || "*";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin: frontendOrigin
    }
});              // instance of socket.io



// System config..
app.use(express.json());                  // converting OR Parsing json into js object
app.use(cors({ origin: frontendOrigin }));
app.use("/auth", authRouter);

// Socket auth (JWT). This runs before any socket handlers.
io.use(authSocket);

editorSocket(io);

// Manual config..
const PORT = process.env.PORT || 2000;
connectDB();


app.use("/session", sessionRouter);



server.listen(PORT, () => {                                    // .listen starts the server.. ("server" not "app" cause http is the one handling now)
    console.log(`Server is running on PORT: ${PORT}`);
});

 

app.use(errorHandler);
