const jwt=require("jsonwebtoken");
const userModel=require('../models/User.js');
var checkUserAuth=async(req,res,next)=>{
    let token;
    const {authorization}=req.headers;
    if(authorization && authorization.startsWith('Bearer')){
        try {
            // Get Token form header
            token=authorization.split(' ')[1];
            console.log('token is this',token);
            console.log(('Authorization is ',authorization));
            ///Verify Token
            const {userID}=jwt.verify(token,process.env.JWT_SECRET_KEY)
            console.log(userID)
            // Get User from Token
            req.user=await userModel.findById(userID).select('-password');
            //console.log(req.user._id);
            
            next();
        } catch (error) {
            res.status(401).send({
                status:'Failed',
                message:"UnAuthorized User"
            })
        }
    }
    if(!token){
        res.status(401).send({
            status:'Failed',
            message:"UnAuthorized User No Token"
        })
    }
}
module.exports=checkUserAuth;