const express = require("express");
const mongoose = require("mongoose"); //databse
const router = express.Router();        //routes
const passport = require("passport");    //Authentication
const session = require("express-session");
const MongoStore = require('connect-mongo');
const googleStrategy = require("passport-google-oauth2").Strategy;
var _ = require("lodash");
var bodyParser = require("body-parser");
const userModel = mongoose.model("userModel");
const cloudinary = require("../api/imageupload");

require('dotenv').config()


express().locals._ = _;
router.use(session({
    secret: "abcd",
    store: new MongoStore({
      mongoUrl: 'mongodb+srv://ishant:'+process.env.MONGO_PASSWORD+'@cluster0.qho5cx4.mongodb.net/MessDB',
      ttl: 14 * 24 * 60 * 60 // = 14 days. Default
  }),
    resave: false,
    saveUninitialized: false
}))

router.use(passport.initialize());
router.use(passport.session());
router.use(require("../middlewares/flash"));
router.use(require("../middlewares/emailverify"));
router.use(bodyParser.urlencoded({ extended: true }));

//============== LOCAL STRATEGY =========================

passport.use(userModel.createStrategy());

//============== ! LOCAL STRATEGY =======================

//============== GOOGLE STRATEGY ========================

passport.use(new googleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://mess-tan.vercel.app/auth/google/googleform"
},
function(accessToken, refreshToken, profile, done) {
  // console.log(profile);
  // userModel.findOrCreate({name: profile.given_name, email: profile.email, googleId: profile.id, profilephoto: profile.photos[0].value}, function(err, user){
  //   return done(err, user);
  // })
  userModel.findOrCreate({email: profile.email}, {name: profile.given_name, googleId: profile.id, profilephoto: profile.photos[0].value}, async function(err, user){
    user.role = "student";
    await user.save();
    return done(err, user);
  })
}
));

//============== ! GOOGLE STRATEGY ======================


passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());


//================ GOOGLE ROUTES =================

router.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/auth/google/googleform",
  passport.authenticate("google", {successRedirect: "/", failureRedirect: "/login"})
  // res.render("auth/googleform");
);

router.get("/googleform", async (req, res) => {
  if(req.isAuthenticated()){
    const curUser = await userModel.findById(req.user.id);
    const msg = req.flash("msg");
    var toastvalue="";
    if(msg.length> 0){
      toastvalue = "d-block"
    }
    res.render("auth/googleform",{
      toastvalue: toastvalue,
      msg: msg,
      user: curUser
    });
  }
  else{
    res.redirect("/");
  }
})

router.post("/googleform", async (req, res) => {
  if(req.isAuthenticated()){
    const {hostel, room, gender} = req.body;
    await userModel.findOneAndUpdate({email: req.user.email}, {role: "student", hostel: hostel, gender: gender, room: room}).exec();
    req.flash("msg", "Updated successfully");
    res.redirect("/");
  }else{
    res.redirect("/login");
  }
})

//================ ! GOOGLE ROUTES =================


//--------------  SIGN UP ROUTE -----------------
router.get("/signup", (req, res) => {
  const msg = req.flash("msg");
  var toastvalue;
  if(msg.length > 0){
    toastvalue = "d-block";
  }
  res.render("auth/signup",{
    toastvalue: toastvalue,
    msg: msg
  });
})

router.post("/signup", async (req, res)=>{
  const {name, email, hostel, room, gender, role} = req.body;
  var profileimageURL;
  if(!req.files){
    profileimageURL = "../images/dummyprofilepic.png";
  }else{
    var profileimage = req.files.profileimage;
    profileimageURL = new Promise((resolve, rejct) => {
      cloudinary.uploader.upload(String(profileimage.tempFilePath),
        function(error, result) {
          if(error){
            console.log(error);
          }
          resolve(result.secure_url);
        }
      );
    })

    profileimageURL = await profileimageURL;
  }
  
  userModel.register({ name: _.capitalize(name), email: _.toLower(email), hostel: _.capitalize(hostel), room: room, gender: gender, role: role, profilephoto: profileimageURL}, req.body.password, async (err, user)=>{
    if(err){
        res.redirect("/", {
          toastvalue: "d-block",
          msg: "Email already exists."
        })
    } 
    else{
        passport.authenticate("local")(req, res, () => {
          if(!user.is_verified && user.role == "student"){
            res.redirect("/verify-email");
          }
          else if(role == "student"){
            req.flash("msg", "user added successfully.");
            res.redirect("/");
          }
          else{
            res.redirect("/adminhome");
          }
        })
    }
  })
})


//--------------- SIGN IN ROUTE ------------------
router.get("/login", (req, res) => {
  const msg = req.flash("error");
  if(msg.length > 0){
    res.render("auth/login",{
      toastvalue: "d-block",
      msg: msg
    });
  }else{
    res.render("auth/login",{
      toastvalue: "",
      msg: ""
    });
  }
})


router.post("/login", async (req, res) => {
  const user = new userModel({
    email: req.body.email,
    password: req.body.password
  });
  const formname = req.body.formname;
  const checkUser = await userModel.find({email: user.email}).exec();
  if(checkUser.length == 0){
    req.flash("msg", "email not registered");
    res.redirect("/signup");
  }
  else if(checkUser[0].role !== formname && checkUser[0].role !== "chiefwarden"){
    req.flash("msg", "Unauthorized");
    res.redirect("/");
  }
  else if(!checkUser[0].is_verified){
    req.flash("msg", "Please verify your email");
    res.redirect("/");
  }
  else if(checkUser[0].state == "blocked"){
    req.flash("msg", "You are not allowed");
    res.redirect("/");
  }
  else{
    passport.authenticate("local", {failureRedirect: "/login", failureFlash: "Incorrect password"})(req, res, ()=>{
      // if( checkUser[0].role === "chiefwarden" ){
      //  res.redirect("chiefwarden");
      // }else{
      res.redirect("/");
    // }
    })
  }
});


//--------------- LOGOUT ROUTE  ------------------------

router.post("/logout", (req, res) => {
  req.logout(function(err) {
      if (err) { 
          console.log(err);
       }
      res.status(200).redirect("/");
      // res.status(200).send("logged out");
  });
});




//--------------- CHANGE PASSWORD ROUTE   -----------------------



//--------------  RESET PASSWORD ROUTE  -----------------------

module.exports = router