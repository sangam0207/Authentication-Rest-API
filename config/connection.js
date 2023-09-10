const mongoose=require('mongoose');
const DATABASE_URL=process.env.DATABASE_URL
mongoose.connect(`${DATABASE_URL}/Auth-DB`)
.then(()=>{
    console.log('connection is Successful')
}).catch((err)=>{
    console.log('Connection is fail due to',err)
});