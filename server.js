const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
require('dotenv').config();

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  // connect to your own database here
  client: 'pg',
  connection: {
    host : process.env.DB_Host, //same as local host
    user : process.env.DB_User,
    password : process.env.DB_Password,
    database : process.env.DB_Database
  }
});


// console.log(db); 
// db('login').where('name', 'Trever').select('*')
//   .then(user => console.log(user));
// db.select('*').from('login').where({email: 'Trever@gmail.com'})
//   .then(user => console.log(user)) 
//   .catch(err => console.log(err)); 

// const ClarifyAPIKey = process.env['CLARIFI_API_KEY']
// console.log(ClarifyAPIKey); 


const app = express();

app.use(cors())
app.use(bodyParser.json());

app.get('/', (req, res)=> { res.send(db.users) })
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(3000, ()=> {
  console.log('app is running on port 3000');
})
