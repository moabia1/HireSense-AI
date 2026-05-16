const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const tokenBlacklistModel = require("../models/blacklist.model")
/**
 * @name Register Controller
 * @description Register a new user, expects username, email and password in the request body, returns a JWT token if successful
 * @access Public
 */
async function registerController(req, res) {
  const { username, email, password } = req.body
  
  if (!username || !email || !password) {
    return res.status(400).json({
      message: "fill the all fields"
    })
  }

  const isUserExists = await userModel.findOne({
    $or: [{ username: username }, { email: email }]
  })

  if (isUserExists) {
    return res.status(400).json({
      message: "user already exists"
    })
  }

  const hash = await bcrypt.hash(password, 10)
  
  const user = await userModel.create({
    username,
    email,
    password:hash  
  })

  const token = jwt.sign({
    id: user._id,
    username: user.username
  }, process.env.JWT_SECRET, { expiresIn: "1d" })
  
  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // ← HTTPS required
    sameSite: "None", // ← cross-domain ke liye
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  
  return res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      username: user.username,
      email:user.email
    }
  })
}



/**
 * @name loginUserController
 * @description Login a user, expects email and password in the request body, returns a JWT token if successful
 * @access Public
 */
async function loginController(req, res) { 
  const { email, password, username } = req.body
  
  const user = await userModel.findOne({
    $or:[{email:email},{username:username}]
  })

  if (!user) {
    return res.status(400).json({
      message: "Invalid credentials"
    })
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return res.status(400).json({
      message:"Invalid email or password"
    })
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    {expiresIn:"1d"}
  )

  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // ← HTTPS required
    sameSite: "None", // ← cross-domain ke liye
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(201).json({
    message: "User login successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}



/**
 * @name logoutController
 * @description Logout a user, expects a valid JWT token in the request header, adds the token to the blacklist
 * @access Private
 */
async function logoutController(req,res) {
  const token = req.cookies.token
  if (!token) {
    return res.status(400).json({
      message: "token is required to logout"
    })
  }

  await tokenBlacklistModel.create({ token })
  
  res.clearCookie("token")

  res.status(200).json({
    message: "User logged out successfully"
  })
}



/**
 * @name getMeController
 * @description Get the current logged-in user's information
 * @access Private
 */
async function getMeController(req, res) {
  const user = await userModel.findById(req.user.id)

  res.status(201).json({
    message: "User information retrieved successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    } 
  })
}



module.exports = {
  registerController,
  loginController,
  logoutController,
  getMeController
}