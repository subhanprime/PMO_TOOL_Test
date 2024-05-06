import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
    userId?: string;
    role?: string;
    email?: string;
}

const verifyJwt = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeaders: any = req.headers.authorization || req.headers.Authorization;
    if (!authHeaders?.startsWith(`Bearer `)) return res.sendStatus(409);
    const token = authHeaders.split(" ")[1];

    if (!token) {
        return res.sendStatus(409);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err: Error, decoded: any) => {
        if (err) return res.sendStatus(403);
        req.userId = decoded?.userInfo?.userId;
        req.role = decoded?.userInfo?.role;
        req.email = decoded?.userInfo?.email;
        next();
    });
};

export default verifyJwt;
