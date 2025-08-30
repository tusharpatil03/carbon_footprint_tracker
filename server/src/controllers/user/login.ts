import { SignupInfo } from './signup';
import {  User } from '../../models/User';
import HandleError from '../../utils/Error/error';
import {
  generateAccessToken,
  InterfaceAccessTokenPayload,
} from '../../utils/auth';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

export const login = async (req: Request, res: Response): Promise<void> => {
  const data: SignupInfo = req.body;

  try {
    const user = await User.findOne({
      email: data.email,
    }).select('password').lean();

    if (!user) {
      throw new HandleError('USER NOT EXIST', 'user not found', 400);
    }

    const isValidPassword: boolean = await bcrypt.compare(
      data.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new HandleError('Wrong Password', 'Incorrect Password', 400);
    }

    const accessTokenPayload: InterfaceAccessTokenPayload = {
      email: data.email,
      userId: user._id.toString(),
    };

    const accessToken = generateAccessToken(accessTokenPayload);

    if (!accessToken) {
      throw new HandleError('JWT ERROR', 'unable to create JWT tokens', 500);
    }

    res.cookie('token', accessToken, {
      path: '/',
      httpOnly: true,
      secure: true,
    });

    res.status(200).json({
      message: 'login success',
      accessToken: accessToken,
    });
  } catch (e: unknown | HandleError) {
    console.log(e);
    res.status(500).json({
      message: e,
    });
  }
};
