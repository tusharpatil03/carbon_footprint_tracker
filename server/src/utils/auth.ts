import jwt from "jsonwebtoken";

export interface TokenPayload {
    email: string;
    id: string;
}

export const generateToken = (input: TokenPayload) => {
    return jwt.sign({
        data: input,
    },
        "sij oeifoij fofij f",
        {
            expiresIn: 60 * 60,
        }
    );
}