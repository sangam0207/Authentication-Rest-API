const dotenv=require('dotenv');
dotenv.config();
const express=require('express')
require('./config/connection');
const cors=require('cors');

const app=express();
const userRoutes=require('./routes/userRoutes.js')
const port=process.env.PORT
// CORS Policy
app.use(cors());
// JSON
app.use(express.json());
// Load Routes
app.use("/api/user",userRoutes)


app.listen(port,()=>{
    console.log(`Server listening at http://localhost:${port}`)
})