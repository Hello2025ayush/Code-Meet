import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import sessionRouter from "./routes/session.router.js";            
import { errorHandler } from "./middlewares/errorHandler.js";

// System config..
dotenv.config();
const app = express();
app.use(express.json());                  // converting OR Parsing json into js object


// Manual config..
const PORT = process.env.PORT || 2000;
connectDB();


app.use("/session", sessionRouter);


app.get("/idk", (req, res) => {
    res.send("This is COde Meet");
});

app.listen(PORT, () => {                                // .listen starts the server..
    console.log(`Server is running on PORT: ${PORT}`);      
})
 

app.use(errorHandler);