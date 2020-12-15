const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../../config/secret')

module.exports = (req, res, next) => {
  // pull the token from header
  // verify it
  const token = req.headers.authorization

  if(!token) {
    res.status(401).json('we want token')
  }
  else{
    // check it with jwt
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        res.status(401).json('we wants GOOD token: ' + err.message)
      }
      else {
        // tack the token to req
        req.decodedToken = decoded
        next()
      }
    })
  }
};
