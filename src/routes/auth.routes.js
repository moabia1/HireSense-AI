const express = require("express")
const {registerController,loginController, logoutController} = require("../controllers/auth.controller")

const authRouter = express.Router()

/**
 * @route POST /auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post("/register", registerController)


/**
 * @route POST /auth/login
 * @desc Login a user
 * @access Public
 */
authRouter.post("/login", loginController)


/**
 * @route GET /auth/logout
 * @desc Logout a user, expects a valid JWT token in the request header, adds the token to the blacklist
 * @access Private
 */
authRouter.get("/logout",logoutController)

module.exports = authRouter