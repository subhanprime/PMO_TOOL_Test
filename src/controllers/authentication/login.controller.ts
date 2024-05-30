import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import User from "../../models/users/users";
import CustomError from "../../Errors/customError"; // Adjust the path to your CustomError class
import createTokens from "../../helpers/createTokens"; // Adjust the path to your createTokens function
import { GENERAL_ERROR, VALIDATIONS } from "../../constant/enums/validations"; // Adjust the path to your constants

export const LoginControl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    console.log(email, password);

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: VALIDATIONS.PROVIDE_CREDENTIALS, status: false });
    }

    const foundUser: any = await User.findOne({ where: { email } });
    if (!foundUser) {
      console.log("ddd");
      return res
        .status(400)
        .json({ message: "Invalid credentials", status: false });
    }

    const passwordMatch = await bcrypt.compare(password, foundUser.password);

    if (!passwordMatch) {
      return res
        .status(400)
        .json({ message: "Email or Password is Wrong", status: false });
    }

    const { accessToken, refreshToken } = createTokens({
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
  } catch (err) {
    console.log("eeeerrrr", err);
    return next(new CustomError(GENERAL_ERROR.WENT_WRONG, 400));
  }
};
