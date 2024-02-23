import { Request, Response } from "express";
import User, { IUser } from "../SchemaModule/userSchemaModule";
import argon2 from "argon2"
const { makeToken } = require('../utils')
const { sendMail } = require('../email/email')

// Define an interface
interface Person {
    name: string;
    email?: string; // Optional property
    password: string;
    role: string,
    confirmPassword: string,
    isActive: boolean;
}

interface loginPerson {
    email: string;
    password: string
}

// otp genration
const generateOtp = () => {
    const otp = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return otp;
}

const checkPassword = (password: string, confirmPassword: string) => {
    return password === confirmPassword
}

module.exports.signUp = async (req: Request<loginPerson>, res: Response, next: Function) => {
    const { email, password, confirmPassword } = req.body;
    try {
        const user: IUser | null = await User.findOne({
            email,
        });
        // email checking
        if (user) {
            return res.status(400).send({
                msg: "Your email is already registered",
            });
        }

        // password checking
        const isSamePassword = checkPassword(password, confirmPassword)

        if (!isSamePassword) {
            return res.status(400).send({
                msg: "Password does not match"
            })
        } else {
            delete req.body.confirmPassword
        }

        // password hash
        const hashPassword = await argon2.hash(password)

        const registerUser = await User.create({ ...req.body, password: hashPassword })


        if (registerUser) {
            return res.status(200).send({ id: registerUser._id })
        }
    } catch (err) {
        next(err)
    }
};

module.exports.login = async (req: Request<Person>, res: Response, next: Function) => {
    const { email, password } = req.body;
    
    try {
        const registeredUser: IUser | null = await User.findOne({
            email
        });
        // email checking
        if (!registeredUser) {
            return res.status(400).send({
                msg: "Your are not a registered user",
            });
        }

        const passwordOk = await argon2.verify(registeredUser.password, password)

        if (!passwordOk) {
            return res.status(400).send({
                msg: "Your Password Does Not Match"
            })
        }
        //token
        const token = makeToken(registeredUser)

        if (token) {
            return res.status(200).send({ token: token })
        }
    } catch (err) {
        next(err)
    }
};

module.exports.info = async (req: Request, res: Response, next: Function) => {
    try {
        const userInfo = await User.findOne({
            _id: res.locals.user,
        },
            'id name email'
        );
        const json = JSON.parse(JSON.stringify(userInfo));        
        return res.status(200).send(json);
    } catch (error) {
        next(error);
    }
}

module.exports.otpGenerate = async (req: Request, res: Response, next: Function) => {
    const { email } = req.body;
    const otp = generateOtp()
    try {
        const registeredUser: IUser | null = await User.findOne({
            email
        });
        // email checking
        if (!registeredUser) {
            return res.status(400).send({
                msg: "Your are not a registered user",
            });
        }
        // content for email
        const mailOptions = {
            from: 'vijayshagara1221@gmail.com',
            to: email,
            subject: '',
            text: `Your four-digit OTP is ${otp}.`
        };
        mailOptions.subject = 'Forget Password'
        // send email for otp
        await sendMail(mailOptions)
        
        registeredUser.otp = otp
        await registeredUser.save()
        return res.status(200).send({
            msg: 'Your OTP has been successfully sent to your email.'
        });

    } catch (error) {
        next(error);
    }
}

module.exports.forgetPassword = async (req: Request, res: Response, next: Function) => {
    try {
        const { key } = req.query
        const registeredUser: IUser | null = await User.findOne({
            otp: key
        });

        // user checking
        if (!registeredUser) {
            return res.status(400).send({
                msg: "Your are not a registered user",
            });
        }
        if(registeredUser){
            if (req.body && req.body.password && req.body.confirmPassword) {
                if (req.body.password === req.body.confirmPassword) {
                    registeredUser.password = await argon2.hash(req.body.password)
                    // empty otp in DB
                    registeredUser.otp = null
                    await registeredUser.save()
                    return res.status(200).send({ msg: 'Your password has been changed successfully.' })
                }else{
                    return res.status(200).send({ msg: 'Your passwords do not match.' })   
                }
            }
        }
    } catch (error) {
        next(error)
    }

}


