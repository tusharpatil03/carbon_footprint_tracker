import express from "express";
import userRoutes from "./routes/user";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: '*',
        credentials: true,
    }),
);

app.use(cookieParser());

app.use("/hello", (req, res) => {
    res.status(200).json({
        message: "hello"
    })
});

app.use("/user", userRoutes);

export default app;