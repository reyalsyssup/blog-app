const express = require("express"),
app = express(),
mongoose = require("mongoose"),
sessions = require("client-sessions"),
bcrypt = require("bcryptjs"),
methodOverride = require("method-override");

if(process.env.NODE_ENV !== "production") require("dotenv").config();
const PORT = process.env.PORT;

const User = require("./models/User"),
Post = require("./models/Post"),
Comment = require("./models/Comment");

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(sessions({
    cookieName: "session",
    secret: process.env.SECRET,
    duration: 60*10*30 // 30 mins
}));

app.set("view engine", "ejs");

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

// routes
require("./routes")(app, User, Post, bcrypt);

app.listen(PORT, console.log(`Serving port ${PORT} at http://localhost:${PORT}`));