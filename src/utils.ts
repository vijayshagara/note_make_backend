const jwt = require("jsonwebtoken");


const makeToken = (payload:{})=>{

    var token = jwt.sign({
        ...payload,
        exp: Math.floor(Date.now() / 1000) + (60 * 60),   
    },process.env.SECRECT_KEY)        
   return token
}

const verifyTwt = ({token}:{token:string})=>{
   const vrt = jwt.verify(token,process.env.SECRECT_KEY);   
   return vrt
}

module.exports = {
    makeToken,
    verifyTwt
}