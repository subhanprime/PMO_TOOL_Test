"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activeAccount = void 0;
const users_1 = __importDefault(require("../../models/users/users"));
const validations_1 = require("../../constant/enums/validations"); // Adjust the path to your constants
const activeAccount = async (req, res) => {
    try {
        const { email, token } = req.query;
        if (!email || !token) {
            return res.status(400).json({
                status: false,
                message: validations_1.VALIDATIONS.PROVIDE_CREDENTIALS,
                data: null,
            });
        }
        const foundUser = await users_1.default.findOne({ where: { email } });
        if (!foundUser) {
            return res.status(400).json({
                status: false,
                message: validations_1.VALIDATIONS.PROVIDE_CREDENTIALS,
                data: null,
            });
        }
        if (foundUser.resetToken !== token) {
            return res
                .status(400)
                .json({ status: false, message: validations_1.LINKS.EXPIRE, data: null });
        }
        await foundUser.update({
            resetToken: null,
            isAccountVerified: true,
        });
        res
            .status(200)
            .json({ message: "Account is active", email, token, data: foundUser });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ message: validations_1.GENERAL_ERROR.WENT_WRONG, status: false });
    }
};
exports.activeAccount = activeAccount;
