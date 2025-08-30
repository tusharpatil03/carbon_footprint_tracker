import { Router } from "express";
import { userRoute } from "../controllers/user/user";
import { recomendation } from "../controllers/user/reconmendation";
import { login } from "../controllers/user/login";
import { signup } from "../controllers/user/signup";

const router = Router();

router.get("/", userRoute);

router.get("/recomendation", recomendation);

router.post("/signup", signup);

router.post("/login", login);

export default router;