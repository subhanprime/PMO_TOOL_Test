"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
const createTokens = (data) => {
    const accessToken = jwt.sign({ userInfo: data }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
    const refreshToken = jwt.sign({ userInfo: data }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
    return { accessToken, refreshToken };
};
exports.default = createTokens;
