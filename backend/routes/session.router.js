import express from "express"
import {createSession, joinSession} from "../controllers/session.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

import {validateSessionCode} from "../middlewares/validateSessionCode.js";
import { createSessionValidate } from "../middlewares/createSessionValidate.js";

const router = express.Router();

router.post("/create", requireAuth, createSessionValidate, createSession);
router.post("/join", requireAuth, validateSessionCode, joinSession);


export default router;          // exports all router paths (.get, .post etc)
                                // can import via alias in server.js