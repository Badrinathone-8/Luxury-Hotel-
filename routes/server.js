const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(session({
    secret: "my supersecret string",
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

// 🔥 This makes `success` and `error` available in all views
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.get("/response", (req, res) => {
    let { name } = req.query;
    req.session.name = name;
    req.flash("success", "Successfully registered");
    res.redirect("/hello");
});

app.get("/hello", (req, res) => {
    res.render("page", { name: req.session.name }); // No need to pass `success`
});

app.listen(3000, () => {
    console.log("App is listening");
});
