import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { VALIDATIONS } from "../../constant/enums/validations";
import User from "../../models/users/users";
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("resetPassword");
    const { email, newPassword, password } = req.body;

    if (!email || !newPassword || !password) {
      return res
        .status(200)
        .json({
          status: false,
          data: null,
          message: VALIDATIONS.PROVIDE_CREDENTIALS,
        });
    }

    const foundUser: any = await User.findOne({ where: { email } });

    if (!foundUser) {
      return res
        .status(400)
        .json({
          status: false,
          message: VALIDATIONS.PROVIDE_CREDENTIALS,
          data: null,
        });
    }

    const passwordMatch = await bcrypt.compare(password, foundUser.password);
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
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

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
  } catch (err) {
    console.log(err);
    res.status(400).json({ status: false, message: "Some Thing Went Wrong" });
  }
};
