import { NextFunction, Request, Response } from "express";
import { Sequelize } from "sequelize";
import User from "../../models/users/users";
import {
  GENERAL_ERROR,
  LINKS,
  VALIDATIONS,
} from "../../constant/enums/validations"; // Adjust the path to your constants

export const activeAccount = async (req: Request, res: Response) => {
  try {
    const { email, token } = req.query;

    if (!email || !token) {
      return res.status(400).json({
        status: false,
        message: VALIDATIONS.PROVIDE_CREDENTIALS,
        data: null,
      });
    }

    const foundUser: any = await User.findOne({ where: { email } });

    if (!foundUser) {
      return res.status(400).json({
        status: false,
        message: VALIDATIONS.PROVIDE_CREDENTIALS,
        data: null,
      });
    }

    if (foundUser.resetToken !== token) {
      return res
        .status(400)
        .json({ status: false, message: LINKS.EXPIRE, data: null });
    }

    await foundUser.update({
      resetToken: null,
      isAccountVerified: true,
    });

    res
      .status(200)
      .json({ message: "Account is active", email, token, data: foundUser });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: GENERAL_ERROR.WENT_WRONG, status: false });
  }
};
