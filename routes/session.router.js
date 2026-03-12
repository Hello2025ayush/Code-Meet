import express from "express"
import createSession from "../controllers/session.controller.js";

const router = express.Router();

router.post("/create", createSession);



export default router;          // exports all router paths (.get, .post etc)
                                // can import via alias in server.js