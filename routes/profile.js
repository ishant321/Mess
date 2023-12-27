const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

require("../models/user");
require("../models/post");

const userModel = mongoose.model("userModel");
const postModel = mongoose.model("postModel");




router.get("/profile", async (req, res) => {
    if(req.isAuthenticated()){
        if(!req.user.hostel){
            req.flash("msg", "please fill out these fields");
            return res.redirect("/googleform");
        }
        const user = await userModel.findById( req.user.id ).exec();
        const post = await postModel.find( { postedby: req.user.id } ).exec();
        if(req.user.role == "admin"){
            res.redirect("/adminhome");
        }
        else{
            res.render("profile",{
                user: user,
                post: post
            });
        }
    }
    else{
        res.redirect("/login");
    }
});

router.get("/userprofile/:id", async (req, res) => { //for viewing in admin page
    if(req.isAuthenticated()){
        const user = await userModel.findById( req.params.id ).exec();
        const post = await postModel.find( { postedby: req.params.id } ).exec();
        res.render("userprofile",{
            user: user,
            post: post
        });
    }
    else{
        res.redirect("/login");
    }
})


module.exports = router;