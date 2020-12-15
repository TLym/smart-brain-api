const redisClient = require('./signin.js').redisClient; 

const requireAuth = (req, res, next) => { //when you call next, it runs the next function/method in the original end-point request. 
  const {authorization} = req.headers; 
  if (!authorization) {
    return res.status(401).json('Unauthorized')
  } 
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(401).json('Unauthorized')
    }
    console.log('you shall pass'); 
    return next(); //this is a middleware, so must call next to keep everything moving after this completes it's work
  })
}

module.exports = {
  requireAuth: requireAuth
};