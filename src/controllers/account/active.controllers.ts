import { NextFunction, Request, Response } from "express";
import { pool } from "../../db/pgdb";
import { GENERAL_ERROR, LINKS, VALIDATIONS } from "../../constant/enums/validations";

export const activeAccount = async (req: Request, res: Response) => {

    try {
        const { email, token } = req.query;

        if (!email || !token) {
            return res.status(400).json({ status: false, message: VALIDATIONS.PROVIDE_CREDENTIALS, data: null })
        }

        const { rows } = await pool.query(`SELECT * FROM USERS WHERE email='${email}'`);
        const foundUser = rows[0];

        if (!foundUser) {
            return res.status(400).json({ status: false, message: VALIDATIONS.PROVIDE_CREDENTIALS, data: null })
        }

        console.log(foundUser, token);
        if (foundUser.resetToken != token) {
            return res.status(400).json({ status: false, message: LINKS.EXPIRE, data: null })
        }

        await pool.query(`
        UPDATE users
        SET "resetToken" = null, "isAccountVerified" = true
        WHERE "email" = '${email}'
        `);

        res.status(200).json({ message: "account is active ss", email, token, rows })
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: GENERAL_ERROR.WENT_WRONG, status: false })
    }


}