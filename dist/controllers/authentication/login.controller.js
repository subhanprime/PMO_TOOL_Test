"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginControl = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const users_1 = __importDefault(require("../../models/users/users"));
const customError_1 = __importDefault(require("../../Errors/customError")); // Adjust the path to your CustomError class
const createTokens_1 = __importDefault(require("../../helpers/createTokens")); // Adjust the path to your createTokens function
const validations_1 = require("../../constant/enums/validations"); // Adjust the path to your constants
const LoginControl = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: validations_1.VALIDATIONS.PROVIDE_CREDENTIALS, status: false });
        }
        const foundUser = await users_1.default.findOne({ where: { email } });
        if (!foundUser) {
            console.log("ddd");
            return res
                .status(400)
                .json({ message: "Invalid credentials", status: false });
        }
        const passwordMatch = await bcryptjs_1.default.compare(password, foundUser.password);
        if (!passwordMatch) {
            return res
                .status(400)
                .json({ message: "Email or Password is Wrong", status: false });
        }
        const { accessToken, refreshToken } = (0, createTokens_1.default)({
            userId: foundUser.id,
            role: foundUser.role,
            email: foundUser.email,
        });
        await foundUser.update({ refresh_token: refreshToken });
        res.status(200).json({
            data: {
                email: foundUser.email,
                role: foundUser.role,
                id: foundUser.id,
                firstName: foundUser.firstname,
                lastName: foundUser.lastname,
                accessToken,
                refreshToken,
            },
            status: true,
            message: "User Login Successfully",
        });
    }
    catch (err) {
        console.log("eeeerrrr", err);
        return next(new customError_1.default(validations_1.GENERAL_ERROR.WENT_WRONG, 400));
    }
};
exports.LoginControl = LoginControl;
