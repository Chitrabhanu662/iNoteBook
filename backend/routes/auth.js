const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../midleware/fetchuser');

const JWT_SECRET = 'chitrabhanuisagoodb$oy'

//Route 1: create a user using: POST "/api/auth/createuser". No login required
router.post('/createuser', [
  body('name', 'enter a valid name').isLength({ min: 5 }),
  body('email', 'enter a valid email').isEmail(),
  body('password', 'password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
  let success = false;
  // If there are errors, return Bad requst and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success, errors: errors.array() });
  }
  //  check whether the user with this email exists already 
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({success, error: "sorry a user with this email already exists" })
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password,salt);

    // Create a new user
    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email,
    })
    const data = {
      user:{
        id: user.id
      }
    }
    const authtoken = jwt.sign(data,JWT_SECRET);
  
    // res.json(user)
    success = true;
   res.json({success, authtoken})

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server Error");
  }
})

//Route 2: authenticate a  user using: POST "/api/auth/login". No login required
router.post('/login', [
  body('email', 'enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
  let success = false;
 // If there are errors, return Bad requst and the errors
 const errors = validationResult(req);
 if (!errors.isEmpty()) {
   return res.status(400).json({ errors: errors.array() });
 }

 const {email,password} = req.body;
 try {
  let user = await User.findOne({email});
  if(!user){
    success = false
    return res.status(400).json({error:"please try to login with correct credentials"});
  }

  const passwordcompare = await bcrypt.compare(password,user.password);
  if(!passwordcompare){
    success = false
    return res.status(400).json({ success,error:"please try to login with correct credentials"});
  }

  const data = {
    user:{
      id: user.id
    }
  }


  const authtoken = jwt.sign(data,JWT_SECRET);
  success = true;
   res.json({success, authtoken})

 } catch (error) {
  console.error(error.message);
  res.status(500).send("Internal server Error");
}

    })    

//Route 3: Get loggedin User Details using: POST "/api/auth/getuser".  login required
router.post('/getuser',fetchuser, async (req, res) => {

try {
  // console.log(req.user);
  userId = req.user.id;
  const user = await User.findById(userId).select("-password")
   res.send(user);
}
 catch (error) {
  console.error(error.message);
    res.status(500).send("Internal server Error");
}
})

module.exports = router
