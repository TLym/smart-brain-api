const handleRegister = (req, res, db, bcrypt) => {
  // const { email, name, password } = req.body;
  const email = String(req.body.email);
  const name = String(req.body.name);
  const password = String(req.body.password);

  // console.log(typeof(email), typeof(name), typeof(password)); 
  console.log(email, name, password); 

  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission');
  }
  
  const hash = bcrypt.hashSync(password);

  console.log(hash); 
    
  db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return trx('users')
        .returning('*')
        .insert({
          email: loginEmail[0],
          name: name,
          joined: new Date()
        })
        .then(user => {
          res.json(user[0]);
        })
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
  .catch(err => res.status(400).json('unable to register'))
}

module.exports = {
  handleRegister: handleRegister
};


