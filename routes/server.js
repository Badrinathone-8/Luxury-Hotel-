const express=require("express");
const app=express();
var session = require('express-session')
const path=require("path");
const flash=require("connect-flash");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(flash());
app.use(session({secret:"my supersecret string",resave:false,saveUninitialized:true}));
app.get("/response",(req,res)=>{
    let {name}=req.query;
    req.session.name=name;
    req.flash("sucess","sucess registered sucessfully");
    res.redirect("/hello");
})
app.get("/hello",(req,res)=>{
    res.render("page.ejs",{name:req.session.name,msg:req.flash("sucess")});
})

app.listen(3000,()=>{
    console.log("app is listneng")
})

