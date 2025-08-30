import { Request, Response } from "express";

export const userRoute = async (req: Request, res:Response)=> {
    res.status(200).json({
        message: "i am a user"
    })
}