const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")


async function authUser(req, res, next) {
  const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "")
  if (!token) {
    return res.status(401).json({
      message:"Token not provided"
    })
  }

  const tokenInBlacklist = await tokenBlacklistModel.findOne({token})

  if(tokenInBlacklist) {
    return res.status(401).json({
      message: "Token is invalid, please login again"
    })
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token"
    })
  }
}

module.exports = {
  authUser
}