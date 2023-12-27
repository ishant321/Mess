const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
var _ = require("lodash");
const userModel = mongoose.model("userModel");
const postModel = mongoose.model("postModel");
require("../middlewares/flash");


// Handle POST requests to Solve 
router.post('/solved', async (req, res) => {
    if(req.isAuthenticated()){
        const {postId, status} = req.body;
        const updatedPost = await postModel.findByIdAndUpdate(postId, { status: status}, {new: true}); 
        res.redirect("/");   
      }
    else{
        res.redirect("/");
    }
  });
// ! Handle POST requests to Solve 

// Handle POST requests to UnSolve 
router.post('/unsolved', async(req, res) => {
  if(req.isAuthenticated()){
      const {postId, status} = req.body;
      const updatedPost = await postModel.findByIdAndUpdate(postId, { status: status}, {new: true}); 
      res.redirect("/");
    }
  else{
      res.redirect("/");
  }
});
// ! Handle POST requests to UnSolve 


//Handle blocekd

router.post('/server/bscript.js', async (req, res) => {
  const userId = req.body.checkboxState;
  console.log(userId); 
  const curUser = await userModel.findById(userId);

  if(curUser.state == "blocked"){
    const user = await userModel.findByIdAndUpdate(userId, {state: "unblocked"});
  }

  else{
    const user = await userModel.findByIdAndUpdate(userId, {state: "blocked"});
  }
  // Process checkbox state here


  res.json({ message: 'Checkbox state received' });
});

//!Handle blocked


//Handle unblocekd

router.post('/server/uscript.js', async (req, res) => {
  const userId = req.body.checkboxState;
  console.log(userId); 
  const curUser = await userModel.findById(userId);

  if(curUser.state == "blocked"){
    const user = await userModel.findByIdAndUpdate(userId, {state: "unblocked"});
  }

  else{
    const user = await userModel.findByIdAndUpdate(userId, {state: "blocked"});
  }
 

  res.json({ message: 'Checkbox state received' });
});

//!Handle unblocked




module.exports = router;