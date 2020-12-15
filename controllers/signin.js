const jwt = require('jsonwebtoken'); 
const redis = require('redis'); 

//setup Redit: 
const redisClient = redis.createClient(process.env.REDIS_URI);

const handleSignin = (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject('incorrect form submission');
  }
  return db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => user[0])
          .catch(err => Promise.reject('unable to get user'))
      } else {
        Promise.reject('wrong credentials')
      }
    })
    .catch(err => Promise.reject('wrong credentials'))
}

const getAuthTokenID = (req, res) => {
  // console.log('req: ' + req);

  const {authorization} = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    
  // console.log('err: ' + err); 
  // console.log('reply: ' + reply); 
  // res.status(400).json(req.headers);

    if (err || !reply) {
      return res.status(400).json('Unauthorized');
    }
    return res.json({id: reply}); 
  })
}

const signToken = (email) => {
  const jwtPayload = { email }; 
  return jwt.sign(jwtPayload, 'JWT_SECRET', {expiresIn: '2 days'}); //JWT_SECRET should be set up as an environmental variable
}

const setToken = (key, value) => {
  return Promise.resolve(redisClient.set(key, value))
}

const createSessions = (user) => {
  // JWT token, return user data
  const {email, id} = user; 
  const token = signToken(email); 
  return setToken(token, id)
    .then(() => { 
      return {success: 'true', userId: id, token: token}
    })
    .catch(console.log);
}

const signinAuthentication = (db, bcrypt) => (req, res) => {
  // console.log('req: ' + req); 
  // console.log('req.headers: ' + req.headers);
  // console.log(typeof(req.headers));
  // req.headers.map(header => console.log(header));
  // console.log('Authorization: ' + authorization); 

  const {authorization} = req.headers; //used to check to see if the user already has an authorization token active. 
  
  return authorization //if the user sends an authorization token
    ? getAuthTokenID(req, res) //return the userId
    : handleSignin(db, bcrypt, req, res) //otherwise work through login process 
      .then(data => {
        return data.id && data.email ? createSessions(data) : Promise.reject(data)
      })
      .then(session => res.json(session))
      .catch(err => res.status(400).json(err)); 
}

module.exports = {
  signinAuthentication: signinAuthentication, 
  redisClient: redisClient
}