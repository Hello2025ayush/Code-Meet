import express from "express"
import {createSession, joinSession} from "../controllers/session.controller.js";

import {validateSessionCode} from "../middlewares/validateSessionCode.js";
import { createSessionValidate } from "../middlewares/createSessionValidate.js";

const router = express.Router();

router.post("/create", createSessionValidate, createSession);
router.post("/join", validateSessionCode, joinSession);


export default router;          // exports all router paths (.get, .post etc)
                                // can import via alias in server.js