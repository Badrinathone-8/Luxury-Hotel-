module.exports.middleware=((req,res,next)=>{
     if(!req.isAuthenticated()){
        req.user;
        req.flash("error","you must be logged in");
       return  res.redirect("/login");
     }
     next();
})
