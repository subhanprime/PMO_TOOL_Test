"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyJwt = async (req, res, next) => {
    const authHeaders = req.headers.authorization || req.headers.Authorization;
    if (!authHeaders?.startsWith(`Bearer `))
        return res.sendStatus(409);
    const token = authHeaders.split(" ")[1];
    if (!token) {
        return res.sendStatus(409);
    }
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err)
            return res.sendStatus(403);
        req.userId = decoded?.userInfo?.userId;
        req.role = decoded?.userInfo?.role;
        req.email = decoded?.userInfo?.email;
        next();
    });
};
exports.default = verifyJwt;
