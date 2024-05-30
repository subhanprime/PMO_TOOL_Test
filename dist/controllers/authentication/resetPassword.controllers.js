"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const validations_1 = require("../../constant/enums/validations");
const users_1 = __importDefault(require("../../models/users/users"));
const resetPassword = async (req, res, next) => {
    try {
        console.log("resetPassword");
        const { email, newPassword, password } = req.body;
        if (!email || !newPassword || !password) {
            return res
                .status(200)
                .json({
                status: false,
                data: null,
                message: validations_1.VALIDATIONS.PROVIDE_CREDENTIALS,
            });
        }
        const foundUser = await users_1.default.findOne({ where: { email } });
        if (!foundUser) {
            return res
                .status(400)
                .json({
                status: false,
                message: validations_1.VALIDATIONS.PROVIDE_CREDENTIALS,
                data: null,
            });
        }
        const passwordMatch = await bcryptjs_1.default.compare(password, foundUser.password);
        console.log("passwordMatch", passwordMatch);
        if (!passwordMatch) {
            return res
                .status(400)
                .json({
                status: false,
                message: "Please Provide Valid Current Password",
                data: null,
            });
        }
        // Hash the new password
        const salt = await bcryptjs_1.default.genSalt();
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, salt);
        // Update the user's password
        await foundUser.update({ password: hashedPassword });
        return res.status(200).json({
            data: {
                email,
                password: newPassword,
            },
            message: "Password Reset Successfully",
            status: true,
        });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ status: false, message: "Some Thing Went Wrong" });
    }
};
exports.resetPassword = resetPassword;
