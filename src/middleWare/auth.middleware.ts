import { Request, Response, NextFunction } from "express";
const {verifyTwt} = require('../utils')
import { Types } from "mongoose";
const checkForUser = (req: Request, res: Response, next: NextFunction) => {
try {
    const authHeader = req.headers["authorization"];
    
    if (!authHeader) {
        return res.status(403).json({ msg: "Unauthorized" });
    }
    const authSplit = authHeader.split(' ')
    if(authSplit.length !=2){
        return res.status(403).send({
            msg:'unaythorised: user id is in invalid format'
        })
    }
    const token = authSplit[1]
    const jwtPayload = verifyTwt({token})    
    console.log("TTTTTTTTTTuserId===",jwtPayload);
    const userId = new Types.ObjectId(jwtPayload._doc._id);    
    if(userId){
        res.locals.user = userId
        res.locals.userDetials = jwtPayload
    }
    next()
} catch (error) {
    next(error)
    
}
};

export default checkForUser;
