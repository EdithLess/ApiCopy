const jwt=require("jsonwebtoken")
const cookieParser=require('cookie-parser')


const cookiewJwtAuth=(req,res,next)=>{
    const token=req.cookies.token
    try {
        const user=jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user=user
        next()
    } catch (error) {
        res.clearCookie("token")
        return res.send("Some error")
        
    }
    }

module.exports=cookiewJwtAuth