import { Router } from "express";

import { createUser, getMe, loginUser } from "../controller/userController.js";
import auth_middleware from "../middleware/auth.js";

const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/me", auth_middleware, getMe);


export default router;