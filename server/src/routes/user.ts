import { Router } from "express";
import { userRoute } from "../controllers/user/user";
import { recomendation } from "../controllers/user/reconmendation";

const router = Router();

router.get("/", userRoute);

router.get("/recomendation", recomendation);

export default router;