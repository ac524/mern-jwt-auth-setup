const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const util = require("util");

// Get middleware
const authenticateUser = require("./middleware/authenticateUser");
const validateBodyWith = require("./middleware/validateBodyWith");

// Data validators
const { loginValidator, registerValidator } = require("./validation");

// Load User model
const { User } = require("../models");

const jwtSign = util.promisify( jwt.sign );

// Get the currently authenticated user
router.post("/authenticated", authenticateUser, (req, res) => {

  res.json( req.user );

});

/**
 * Log in an existing user by signing and returning a secure JWT token
 * for the client application to store and include with requests.
 */
router.post("/login", validateBodyWith( loginValidator ), async (req, res) => {

  const { email, password } = req.body;

  try {

    const user =
      await User
        .findOne({ email })
        // Restrict the data loaded from the user model
        .select("name email");

    if (!user) {
      // User not found by email.
      return res.status(404).json({ emailnotfound: "Email or password is invalid." });
    }

    const isMatch = await bcrypt.compare( password, user.password );
    
    if( !isMatch ) {
      // User's password is invalid.
      return res.status(404).json({ emailnotfound: "Email or password is invalid." });
    }

    const payload = {
      id: user.id,
      name: user.name
    };

    // Create a signed JWT token to send back to the client for reauthentication.
    const token = await jwtSign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: 31556926 // 1 year in seconds
      }
    );

    return {
      success: true,
      token: "Bearer " + token,
      user
    }
  

  } catch( err ) {

    console.log(err);
    res.status(500).json({ default: "Something went wrong trying to log in." });

  }
});

/**
 * Creates a new user for authentication
 */
router.post("/register", validateBodyWith( registerValidator ), async (req, res) => {

  try {

    const { name, email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      // User already exists error.
      return res.status(400).json({ email: "Email already exists." });
    }

    const newUser = new User({
      name,
      email,
      password: await passwordHash( password )
    });

    await newUser.save();

    res.json( newUser );

  } catch( err ) {

    console.log(err);
    res.status(500).json({ default: "Something went wrong creating your account." });

  }

});

module.exports = router;