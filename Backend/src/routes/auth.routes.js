const express = require("express")
const {registerController,loginController, logoutController, getMeController} = require("../controllers/auth.controller")
const { authUser } = require("../middleware/auth.middleware")

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
authRouter.get("/logout", logoutController)


/**
 * @route GET /auth/get-me
 * @desc Get the current logged-in user's information
 * @access Private
 */
authRouter.get("/get-me", authUser,getMeController)

module.exports = authRouter