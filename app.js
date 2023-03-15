//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5")
const app = express();

console.log(md5("user"));

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true});

// For Level 2 (Database authentication) authentication turn your schema to a proper mongoose schema object (new)
const userSchema = new mongoose.Schema({
    email: String,
    password:String
});

//LEVEL 2 Authentication . 1 add a key to encrypt the database(SECRET IN THE .ENV FILE). 2. Use the plugin


const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home")
});

app.get("/login", function(req, res){
    res.render("login")
});

app.get("/register", function(req, res){
    res.render("register")
});




// 1. LEVEL ONE AUTHENTICATION ///////

app.post("/register", function(req, res){
        const newUser = new User({
            email:req.body.username,
            password:md5(req.body.password)
        });

        try{
            newUser.save();
        }catch(error){
            console.error(error);
        }
        res.render("secrets");
});
app.post("/login", function(req, res){
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({email: username}).then((foundUser) =>{
        if(foundUser){
            if(foundUser.password === password){
                res.render("secrets");
            }
        }
    }).catch((error) =>{
        console.error(error);
    });
});




















app.listen(3000, function(){
    console.log("Server started on port 3000")
});
