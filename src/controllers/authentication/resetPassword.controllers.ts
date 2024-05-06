import { NextFunction, Request, Response } from "express";
import bcrypt from 'bcrypt';
import { VALIDATIONS } from "../../constant/enums/validations";
import pool from "../../db/pgdb";

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('resetPassword');
        const { email, newPassword, password } = req.body;

        if (!email || !newPassword || !password) {
            return res.status(200).json({ status: false, data: null, message: VALIDATIONS.PROVIDE_CREDENTIALS })
        }
        const query = `SELECT * FROM users WHERE email='${email}'`;
        const { rows } = await pool.query(query);
        const foundUser = rows[0];
        // console.log('reset password', rows[0]);

        const passwordMatch = await bcrypt.compare(password, foundUser.password);
        console.log('passwordMatch', passwordMatch)

        if (!passwordMatch) {
            return res.status(400).json({ status: false, message: "Please Provide Valid Current Password", data: null });
        }


        // Hash the password using the salt
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const passwordUpdate = `UPDATE users set password ='${hashedPassword}' WHERE email='${email}'`;
        await pool.query(passwordUpdate);


        if (!rows[0]) {
            return res.status(400).json({ status: false, message: VALIDATIONS.PROVIDE_CREDENTIALS, data: null });
        }

        return res.status(200).json({
            data: {
                email,
                password: newPassword,
            },
            message: "Password Reset Successfully",
            status: true
        });

    } catch (err) {
        console.log(err);
        res.status(400).json({ status: false, messaage: "Some Thing Went Wrong" })
    }
}


