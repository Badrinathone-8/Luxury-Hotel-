const express = require("express");
const router = express.Router();
const User = require("../models/userr.js");
const wrapasync = require("../utils/wrapasync.js");
const passport=require("passport")

router.get("/signup", (req, res) => {
    res.render("users/sign.ejs");
});

router.post("/signup", wrapasync(async(req, res) => {
    try {
        let { username, email, password } = req.body;
        const newuser = new User({ email, username });
        const registeredUser = await User.register(newuser, password);
   console.log(registeredUser);
        req.flash("success", "Welcome to wanderlust");
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","welcome to wandurlust");
            res.redirect("/listings");
        })
        res.redirect("/listings");
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}))
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

    router.post("/login",passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}) ,async(req,res)=>{
try{
        req.flash("success","welcome to wanderlust! youare logged in ");
res.redirect("/listings");
}catch(error){
    req.flash(error);
}
})
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            
         return   next(err);
        }
        req.flash("success","You are logged out");
        res.redirect("/listings");
    })
})
module.exports = router;
