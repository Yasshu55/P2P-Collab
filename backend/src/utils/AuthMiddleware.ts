import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
import { IUser } from "../db/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "jwtsecret"

export const generateToken = async (user: IUser) => {
    return jwt.sign({ id: user._id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: '7h' });
};

export const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    console.log("AuthMiddleWare function  : ",token);
    
    if (!token) {
        return res.status(401).json({ message: 'Authentication token is missing' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & { id: string };
        req.user = decoded;
        console.log("Successfully Authenticated!");
        
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid authentication token' });
    }
};