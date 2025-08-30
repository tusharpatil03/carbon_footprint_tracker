import { Request, Response } from 'express';
import {  User } from '../../models/User';
import bcrypt from 'bcrypt';
import HandleError from '../../utils/Error/error';
import {
    generateAccessToken,
    InterfaceAccessTokenPayload,
} from '../../utils/auth';

export type SignupInfo = {
    email: string;
    password: string;
};

export const signup = async (req: Request, res: Response): Promise<void> => {
    const data: SignupInfo = req.body;

    const existingUser = await User.findOne({
        email: data.email,
    });
    if (existingUser) {
        throw new HandleError(
            'USER ALREADY EXIST',
            'user already exist, try to login',
            400,
        );
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = await User.create({
        email: data.email,
        password: hashedPassword,
        salt: salt,
    })
    if (!user) {
        throw new HandleError('User Not Exist', 'Unable to Create User', 500);
    }

    const JwtPayload: InterfaceAccessTokenPayload = {
        email: data.email,
        userId: user._id.toString(),
    };

    const accessToken = generateAccessToken(JwtPayload);

    if (!accessToken) {
        throw new HandleError('JWT ERROR', 'unable to create JWT tokens', 500);
    }


    res.cookie('token', accessToken, {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        secure: true,
    });

    res.cookie("token", accessToken, { secure: true, httpOnly: true });

    res.status(200).json({
        message: "signup successful"
    })
};
