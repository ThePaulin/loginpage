//jshint esversion:6

//require dotenv for security
require('dotenv').config();

const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');


const app = express();

//use
app.use(express.json(), express.urlencoded({extended:true})); //body parser
app.use(express.static('public'));

//set
app.set('view engine','ejs');


//connect db
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true});

//schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required:true,
    },
    password: {
        type: String,
        required:true,
    }
});


//encryption of password (important to do after schema)
//get secret from .env file


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

//model
const User = mongoose.model('User', userSchema);

/////ALL PAGES

app.get("/", function(req,res){
    res.render('home');
});
app.get("/login", function(req,res){
    res.render('login');
});
app.get("/register", function(req,res){
    res.render("register")
})





/////SPECIFIC PAGE



//login user

app.post("/login",function(req,res){

    const username = req.body.username;
    const password =req.body.password;
    

    //AUTHENTIFICATION
    User.findOne(
        //find a user in collection who has the same email
        {email: username},
        function(err,foundUser){
            if(!err){
                //verify that the entered password is correct
                if (foundUser.password === password){
                    res.render('secrets');
                }else{
                    console.log("wrong password")
                    res.redirect("/login")
                }
                

            }else{
                self.redirect("/login");
                console.log(err);
                
            }
        })
})

//register new user

app.post("/register", function(req,res){
    //check if uername not taken

    // console.log(req.body.username);
    // User.findOne({email: req.body.username},
    //     function(err,foundUser){
    //         if(!err){
    //             console.log(foundUser.email + "already exists");
    //         }else{
    //                 const newUser = new User(
    //                     {
    //                         email: req.body.username,
    //                         password: req.body.password
    //                     }
    //                 );
    //                 newUser.save();
    //                 res.render('secrets');
    //         }
            
    //     })

    const newUser = new User(
        {
            email: req.body.username,
            password: req.body.password
        }
    );
    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
        }
    });
    
});

app.get("/logout", (req,res)=> {
    res.redirect("/");
})



///listen
app.listen(3000, function(){
    console.log("Server started on port 3000")
});