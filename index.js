const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapasync.js");
const ExpressError = require("./utils/expresserror");
const review = require("./models/review.js");
const { listingSchema } = require("./schema.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./models/userr.js");
const userRouter = require("./routes/user.js");
const listing = require("./models/listing.js");
const {middleware}=require("./middleware.js")

// Connect to MongoDB
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main()
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log(err));

// Set up view engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static and form parsing
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Session and Flash Configuration
const sessionOptions = {
    secret: "Very Secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};
app.use(session(sessionOptions));
app.use(flash());

// Passport Setup
app.use(passport.initialize()); //To use passport first Intialize it
app.use(passport.session())
passport.use(new LocalStrategy(user.authenticate()))
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser());



// Flash Message Middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser=req.user;
    next();
});

// User Routes
app.use("/", userRouter);

// Demo User (for testing)
// .get
app.get("/demouser", async(req,res)=>{
    let fake=new user({
        email:"@badirnat",
        username:"Raja",
    })
   let newuser= await user.register(fake,"hellodear");

   res.send(newuser)
})

// Home Route
app.get("/", (req, res) => {
    res.render("home.ejs");
});

// Listings Routes
app.get("/listings", wrapAsync(async (req, res) => {
    const data = await listing.find({});
    res.render("index.ejs", { data });
}));

app.get("/listings/new", middleware,(req, res) => {
     res.render("new.ejs");
    }
  
);

app.post("/listings", wrapAsync(async (req, res, next) => {
    const result = listingSchema.validate(req.body);
    if (result.error) throw new ExpressError(400, result.error);

    const newlisting = new listing(req.body.listing);
    await newlisting.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}));

app.get("/listings/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const data = await listing.findById(id).populate("reviews");
    res.render("show.ejs", { data });
}));

app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const data = await listing.findById(id);
    res.render("edit.ejs", { data });
}));

app.put("/listings/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
}));

app.delete("/listings/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

// Reviews
app.post("/listings/:id/review", wrapAsync(async (req, res) => {
    const listings = await listing.findById(req.params.id);
    const newreview = new review(req.body.review);
    listings.reviews.push(newreview._id);
    await newreview.save();
    await listings.save();
    res.redirect(`/listings/${listings._id}`);
}));

app.delete("/listings/:id/reviews/:reviewid", wrapAsync(async (req, res) => {
    const { id, reviewid } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await review.findByIdAndDelete(reviewid);
    res.redirect(`/listings/${id}`);
}));

// Catch-all 404 route
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// Global Error Handler
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("error.ejs", { message });
});

// Start server
app.listen(8000, () => {
    console.log("App is running on port 8000");
});
