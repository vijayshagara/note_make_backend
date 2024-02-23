import nodemailer from "nodemailer";
import { configDotenv } from "dotenv";
import { NextFunction } from "express";
configDotenv()

/**
 * @argument emailContent 
 * {
 * from: 'vijayshagara1221@gmail.com',
      to: 'vijay@mailinator.com',
      subject: 'Subject for Test',
      text: '1234'
 * }
 */

interface emailContent {
  from: string,
  to: string,
  subject:string,
  text:string
}

const sendMail = async(emailContent:emailContent,next:NextFunction)=>{
  try {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'vijayshagara1221@gmail.com',
          pass: process.env.Email_password
        }
    });
      
    transporter.sendMail(emailContent)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  sendMail
}