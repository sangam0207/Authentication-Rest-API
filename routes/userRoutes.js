const express=require ('express');
const router=express.Router();
const {userRegistration,userLogin,changeUserPassword,LoggedUser,sendEmailAndResetPassword, ResetPassword} =require('../controllers/userController.js');
const checkUserAuth=require('../middlewares/authMiddleware.js');

//Route Level Middleware -To Perfect Route
router.use('/changePassword',checkUserAuth);
router.use('/LoggedUser',checkUserAuth)


// Public Routes
router.post('/register',userRegistration);
router.post('/login',userLogin);
router.post('/send-reset-password-email',sendEmailAndResetPassword)
router.post('/reset-password/:id/:token', ResetPassword);


// Protected Route
router.post('/changePassword',changeUserPassword)
router.get('/LoggedUser',LoggedUser)

 module.exports=router;
 
 
 //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NGZhMDBkNjM4MjA5YTg2OTBiOWQ0MmMiLCJpYXQiOjE2OTQxNjEwODIsImV4cCI6MTY5NDU5MzA4Mn0.zEPqiwJ9FnHCpp0BzY71oZ8HaHl5pMTycHd99en62-I