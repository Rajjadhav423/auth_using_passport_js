const mongoose=require('mongoose')
const plm=require('passport-local-mongoose')

mongoose.connect("mongodb://localhost:27017/authUsingPassportjs")
.then(()=>{
  console.log("db connected");
  
}).catch(e=>{
  console.log(e)
  console.error(e)
  process.exit(1)
})

const userSchema=new mongoose.Schema({
  username:String,
  pic:String
})

userSchema.plugin(plm)

module.exports=mongoose.model("user",userSchema)