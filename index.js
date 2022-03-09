const express=require("express");
const cors=require("cors");

const app=express();
app.use(cors());
app.get("/test",(req,res,err)=>{
    if(err) throw err;
    res.status(200).json({Mesaage:"success",Data:"Aswinkumar"})
})

app.get("/",(req,res,err)=>{
    if(err) throw err;
    res.status(200).json({Mesaage:"success",Data:"Welcome to my testing...!!"})
})

app.listen(8080,()=>{
    console.log("server Running");
})