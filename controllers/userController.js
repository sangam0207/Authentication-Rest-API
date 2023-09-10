const userModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter=require('../config/emailConfig.js')
const userRegistration = async (req, res) => {
  const { name, email, password, password_confirmation, tc } = req.body;
  const user = await userModel.findOne({ email: email });
  if (user) {
    res.send({
      status: "failed",
      message: "Email already exit",
    });
  } else {
    console.log(name, email, password, password_confirmation, tc);
    if (name && email && password && password_confirmation && tc) {
      if (password === password_confirmation) {
        try {
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(password, salt);
          const doc = new userModel({
            name: name,
            email: email,
            password: hashPassword,
            tc: tc,
          });
          await doc.save();
          const saved_user = await userModel.findOne({ email: email });
          const token = jwt.sign(
            { userID: saved_user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "5d" }
          );
          res.status(201).send({
            status: "success",
            message: "REQUEST IS SUCCESSFUL",
            token,
          });
        } catch (error) {
          console.log(error);
          res.send({
            status: "failed",
            message: "Unable to register",
          });
        }
      } else {
        res.send({
          status: "failed",
          message: "Password and confirmation_password does not match",
        });
      }
    } else {
      res.send({
        status: "Failed",
        message: "All fields are required",
      });
    }
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await userModel.findOne({ email: email });
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (user.email === email && isMatch) {
          const token = jwt.sign(
            { userID: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "5d" }
          );
          res.send({
            status: "Success",
            message: "Successfully Login",
            token,
          });
        } else {
          res.send({
            status: "Failed",
            message: "Email or Password does not match",
          });
        }
      } else {
        res.send({
          status: "Failed",
          message: "User is not registered",
        });
      }
    } else {
      res.send({
        status: "failed",
        message: "All fields are required",
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      status: "fail",
      message: "Can Not Login",
    });
  }
};

const changeUserPassword=async(req,res)=>{
    const {password,password_confirmation}=req.body;
    if(password && password_confirmation){
        if(password===password_confirmation){
          const salt=await bcrypt.genSalt(10);
          const newHashPassword=await bcrypt.hash(password,salt);
         
         
          // Here we have need a authenticate user 
          //req.user.password=newHashPassword;
         
          // console.log(req.user);
          await userModel.findByIdAndUpdate(req.user._id,{$set:{password:newHashPassword}});
        
          res.send({
            status:"success",
            message:"Password Changed Successfully"
          })
          

        }else{
            res.send({
                status:'Failed',
                message:"password and password_confirmation are not match"
            })
        }
    }else{
        res.send({
            status:'failed',
            massage:"All fields are required"
        })
    }
}
const LoggedUser=async(req,res)=>{
  await res.status(200).send({
    status:'success',
    user:req.user
  });
}
const sendEmailAndResetPassword=async(req,res)=>{
 const {email}=req.body;
 if(email){
  const user=await userModel.findOne({email:email});
  console.log(user)
 const secret=user._id+process.env.JWT_SECRET_KEY;
 
  if(user){
   const token=jwt.sign({userID:user._id},secret,{expiresIn:'15m'})
   const link=`http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`;

  console.log(link);
  //  Send Email (We have to work on it Something went wrong)
  
  /*
  await transporter.sendMail({
    from:process.env.EMAIL_FROM,
    to:user.email,
    subject:"Sangam Shukla -Password Reset Link",
    html:`<a href=${link}>Click Here </a> to Reset Your Password`

  })

*/
  res.send({
    status:'successful',
    message:"Password Reset Email Sent... Please Check Your Email",
    link
  })
  }
  else{
    res.send({
      status:'failed',
      massage:"Email does not exits"
    })
  }
 }
 else{
  req.send({
    status:'failed',
    massage:"User's Email is required"
  })
 }
}
const ResetPassword=async(req,res)=>{
  const {password,password_confirmation}=req.body;
  const {id,token}=req.params;
  const user=await userModel.findById(id);
  // this is a secret key because we have to verify token bty its  secret key
  const new_secret=user._id +process.env.JWT_SECRET_KEY;
try {
  jwt.verify(token,new_secret);
  
  if(password && password_confirmation){
    if(password===password_confirmation){
      const salt=await bcrypt.genSalt(10);
      const newHashPassword=await bcrypt.hash(password,salt);
      await userModel.findByIdAndUpdate(user._id,{$set:{password:newHashPassword}});
      res.send({
        status:"success",
        message:"Password Reset Successfully"
      })
      
    }
    else{
      res.send({
        status:"Failed",
        message:"Password and password_confirmation should must be same "
      })
    }
  }
  else{
    res.send({
      status:"failed",
      message:"All fields are required"
    })
  }


} catch (error) {
  res.send({
    status:"failed",
    message:"Invalid token"
  })
}
}
module.exports = { userRegistration, userLogin ,changeUserPassword,LoggedUser,sendEmailAndResetPassword, ResetPassword};
