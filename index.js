const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const override=require("method-override")
const ejsmate=require("ejs-mate");
const wrapasync=require("./utils/wrapasync.js")
const expresserror=require("./utils/expresserror");
const review=require("./models/review.js")
const{listingSchema}=require("./schema.js")
//const session=require("session");
const flash=require("connect-flash");
const passport=require("passport");
const local=require("passport-local");
const user=require("./models/user.js");
const session=require("express-session");


const sessionOptions={
    secret:"Very Secret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:new Date(Date.now()*7*24*60*60*1000),
        maxAge:7*24*60*60*1000,
        httpOnly:true,
},
}





app.use(express.static(path.join(__dirname,"/public")));
app.set("view engine","ejs");
app.engine("ejs",ejsmate);
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(override("_method"));
app.use(require("method-override")("_method"));

async function main(){
    mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')

}
const listing=require("./models/listing.js");
const { wrap } = require("module");
main().then((res)=>{
    console.log("connect to DB");

}).catch((err)=>{
    console.log(err);
})

app.listen(8000,()=>{
    console.log("App is running");
})




app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new local(user.authenticate()))
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    next();``
})
app.get("/demouser",async(req,res)=>{
    let fake=new user({
        email:"badrinath",
        username:"badri",
    })
    let registeruser=await user.register(fake,"hellow");
    res.send(registeruser);
})

app.get("/",(req,res)=>{
    res.render("home.ejs");
})
// app.use(session(sessionOptions))
// app.use(flash);

app.get("/listings",wrapasync(async (req,res)=>{
    let data=await listing.find({});

    res.render("index.ejs",{data:data});


}))

app.put("/listings/:id", wrapasync(async(req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
}))
app.get("/listings/new",wrapasync(async (req,res)=>{
    res.render("new.ejs");
}))

app.get("/listings/:id",wrapasync(async (req,res)=>{
    let {id}=req.params;
    let data=await listing.findById(id).populate("reviews");
    res.render("show.ejs",{data});
}))
app.post("/listings",wrapasync( async (req,res,next)=>{
    let result=listingSchema.validate(req.body);
    if(result.error){
        throw new expresserror(400,result.error);
    }
  
    let newlisting=new listing(req.body.listing);
   
     
     
    await newlisting.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings")
  }
  
))

app.get("/listings/:id/edit",wrapasync(async (req,res)=>{
    let {id}=req.params;
    let data=await listing.findById(id);
    res.render("edit.ejs",{data});
}))
app.delete("/listings/:id",wrapasync(async (req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings")
}))
app.post("/listings/:id/review",async (req,res)=>{
    let listings=await listing.findById(req.params.id);
let newreview = new review(req.body.review);
listings.reviews.push(newreview._id);
await newreview.save();
await listings.save(); 
//res.send("new review saved");
res.redirect(`/listings/${listings._id}`);
})
//DELETE REVIEW ROUTE

app.delete("/listings/:id/reviews/:reviewid",wrapasync(async (req,res)=>{
    let {id,reviewid}=req.params;
    await listing.findByIdAndUpdate(id,{ $pull: {reviews:reviewid}})
    await review.findByIdAndDelete(reviewid);
    res.redirect(`/listings/${id}`);
}))


//PASWORDS
app.get("/Signup",(req,res)=>{
    res.render("signup.ejs");
})




app.all("*",(req,res,next)=>{
    return next(new expresserror(404,"page not found"));
})
  
app.use((err,req,res,next)=>{
   let{status=501,message="something went wrong"}=err;
   res.render("error.ejs",{message});
})