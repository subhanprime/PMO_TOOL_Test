import { pool } from "../../db/pgdb";
import { NextFunction, Request, Response } from "express";
import CustomError from "../../Errors/customError";
import { VALIDATIONS, GENERAL_ERROR } from "../../constant/enums/validations";
import bcrypt from 'bcrypt';
// const crypto = require('crypto');
// const sgMail = require('@sendgrid/mail');
import sgMail from '@sendgrid/mail';
import crypto from 'crypto';

function generateRandomPassword() {
    // Generate 2 bytes of secure random data (16 bits)
    const randomBytes = crypto.randomBytes(2);

    // Convert the random bytes to a number (16-bit integer)
    const randomNumber = randomBytes.readUInt16LE(0);

    // Generate a 5-digit password from the random number (ensure leading zeros if needed)
    const password = randomNumber.toString().padStart(5, '0');

    return password;
}

export const userInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.params;
        console.log(email)
        if (!email)
            return next(new CustomError(VALIDATIONS.PROVIDE_CREDENTIALS, 401))
        // console.log(req.params)
        const user = await pool.query(`SELECT username,id,firstname,lastname,email,role,department from users where email='${email}'`);
        if (!user.rows.length)
            return next(new CustomError(VALIDATIONS.NOT_VALID_EMAIL, 401))
        res.json(user.rows[0]);

    } catch (err) {
        console.log("err", err);
        res.status(400).send(GENERAL_ERROR.WENT_WRONG);
    }
}

export const EditUserInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, firstname, lastname, username, role, department } = req.body;
        console.log(email, firstname, lastname, username, role, department);
        if (!email)
            return next(new CustomError(VALIDATIONS.PROVIDE_CREDENTIALS, 401));

        let codeValues = ''
        if (username) {
            codeValues += `username ='${username}',`
        }
        if (firstname) {
            codeValues += `firstname ='${firstname}',`
        }

        if (lastname) {
            codeValues += `lastname ='${lastname}',`
        }

        if (role) {
            codeValues += `role ='${role}',`
        }
        if (department) {
            codeValues += `department ='${department}',`
        }
        const lastCommaIndex = codeValues.lastIndexOf(',');

        // Remove the last comma if it exists
        codeValues = lastCommaIndex !== -1 ? codeValues.slice(0, lastCommaIndex) + codeValues.slice(lastCommaIndex + 1) : codeValues;

        // codeValues = codeValues.slice(0, -2);
        console.log('codeValues', codeValues)

        const result = await pool.query(
            `
            UPDATE users
            SET ${codeValues}
            WHERE email = $1
            RETURNING email,username, firstname,lastname, role, department;
            `,
            [email]
        );

        console.log('result', result.rows);


        if (!result.rows.length)
            return next(new CustomError(VALIDATIONS.NOT_VALID_EMAIL, 401));

        res.json(result.rows[0]);
    } catch (err) {
        console.log("err", err);
        res.status(400).send(GENERAL_ERROR.WENT_WRONG);
    }
}




export const createUser = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { firstname, lastname, username, role, department, email } = req.body;
        console.log(firstname, lastname, username, role, department, email);

        if (!firstname || !lastname || !username || !role || !department || !email) {
            return res.status(400).json({ message: "Please Provide all fields" })
        }

        const activeToken = generateRandomPassword();
        const link = `${process.env.BASE_URL}/api/active/account?token=${activeToken}&email=${email}`;

        const msg = {
            to: email,
            from: process.env.SEND_GRID_EMAIL,
            subject: `TeamedApp - Password Reset`,
            text: `Email is sending from TeamedApp.`,
            html: `
                <div style="text-align: center; background-color: #f4f4f4; padding: 20px;">
                    <h2>Activation Link</h2>
                    <p>You've requested to active your account for PMO Toll. Click the button below to active it.</p>
                    <p>Please don't share with anyone</p>
                    <a href="${link}" style="background-color: #007bff; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block;">Active Your Account</a>
                </div>
            `,
        };
        // await sgMail.send(msg);

        const queryText = `
        INSERT INTO users (firstname, lastname, username, role, department, email,password)
        VALUES ($1, $2, $3, $4, $5, $6,$7)
        RETURNING *
    `;


        const plainPassword = '12345';
        // const plainPassword = generateRandomPassword;

        const salt = await bcrypt.genSalt();

        // Hash the password using the salt
        const hashedPassword = await bcrypt.hash(plainPassword, salt);

        const queryValues = [firstname, lastname, username, role, department, email, hashedPassword];

        const { rows } = await pool.query(queryText, queryValues);

        console.log('rows', rows);

        res.status(200).json({ result: rows[0] })
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.constraint, err })
    }

}


export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {


    try {
        // id,firstname,lastname,username,role,email,account_status,avatar
        const { rows } = await pool.query('SELECT id,firstname,lastname,username,role,email,account_status,avatar FROM users');
        res.status(200).json({ message: "All Users information", data: rows });
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }

}


