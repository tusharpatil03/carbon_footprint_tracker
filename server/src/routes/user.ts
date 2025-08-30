import { Router } from "express";
import { login } from "../controllers/user/login";
import { signup } from "../controllers/user/signup";

const router = Router();

router.post("/signup", signup);

router.post("/login", login);

export default router;