import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../globals';

export interface InterfaceAccessTokenPayload {
  userId: string;
  email: string;
}


export const generateAccessToken = (
  payload: InterfaceAccessTokenPayload,
): string => {
  const token: string = jwt.sign(
    {
      data: {
        email: payload.email,
        userId: payload.userId,
      },
    },
    ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: 24 * 60 * 60,
    },
  );
  return token;
};

