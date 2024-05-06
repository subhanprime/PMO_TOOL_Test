import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt'
import { UserData } from '../../constant/interfaces/users';
import { pool } from '../../db/pgdb';
import CustomError from '../../Errors/customError';
import createTokens from '../../helpers/createTokens';
import { GENERAL_ERROR, VALIDATIONS } from '../../constant/enums/validations';


export const LoginControl = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { email, password } = req.body;

        console.log(email, password)

        if (!email || !password) {
            return res.status(400).json({ message: VALIDATIONS.PROVIDE_CREDENTIALS, status: false });
            // return next(new CustomError("Please Provide All Credentials", 401))
        }


        const foundUser = await pool.query(`SELECT * FROM users where email = '${email}'`);
        // console.log('foundUser', foundUser.rows, foundUser.rows.length);

        if (!foundUser.rows.length) {
            console.log('ddd')
            // return next(new CustomError("Invalid credentials", 400))
            return res.status(400).json({ message: "invalid credentials", status: false });

        }

        // if (!foundUser?.isAccountVerified) {
        //     return next(new CustomError("Please Verify Your Account First", 401))
        // }

        const passwordMatch = await bcrypt.compare(password, foundUser.rows[0].password);

        if (!passwordMatch)
            return res.status(400).json({ message: "Email or Password is Wrong", status: false });
        // return next(new CustomError("Email or Password is Wrong", 401))

        const { accessToken, refreshToken } = createTokens({
            userId: foundUser.rows[0]?.id,
            role: foundUser.rows[0]?.role,
            email: foundUser.rows[0]?.email
        })

        await pool.query(`UPDATE users SET "refreshToken" = '${refreshToken}' WHERE email ='${email}'`);

        //sending email to users

        res.status(200).json({
            data: {
                email: foundUser.rows[0].email,
                role: foundUser.rows[0].role,
                id: foundUser.rows[0].id,
                firstName: foundUser.rows[0].firstname,
                lastName: foundUser.rows[0].lastname,
                accessToken,
                refreshToken
            },
            status: true,
            message: "User Login Successfully"
        });

    } catch (err) {
        console.log(err)
        // return res.status(400).json({ message: GENERAL_ERROR.WENT_WRONG })
        return next(new CustomError(GENERAL_ERROR.WENT_WRONG, 400))
    }

};
