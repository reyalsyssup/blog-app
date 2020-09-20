const express = require("express"),
app = express(),
mongoose = require("mongoose"),
sessions = require("client-sessions"),
bcrypt = require("bcryptjs");

if(process.env.NODE_ENV !== "production") require("dotenv").config();
const PORT = process.env.PORT;

const User = require("./models/User");

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

// GET REQUESTS

app.get("/", (req, res) => {
    res.render("index", {title: "Home"});
});

app.get("/register", (req, res) => {
    res.render("register", {title: "Register"});
});

app.get("/login", (req, res) => {
    res.render("login", {title: "Login"});
});

// POST REQUESTS
app.post("/register", async (req, res) => {
    let hash = bcrypt.hashSync(req.body.user.password, 14);
    req.body.user.password = hash;
    let user = new User(req.body.user);
    await user.save((err) => {
        if(err) {
            console.log("something went wrong:\n" + err);
            res.redirect("/");
        }
        else res.redirect("/login");
    });
    // check if email is already in use
    // User.find({email: req.body.user.email}, (err, users) => {
    //     if(err) {
    //         console.log(err);
    //         return res.redirect("/");
    //     }
    //     console.log(users);
    // });
});

app.listen(PORT, console.log(`Serving port ${PORT} at http://localhost:${PORT}`));