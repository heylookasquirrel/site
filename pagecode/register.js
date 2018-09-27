const app = require("../main.js").app
const passport = require("../main.js").passport


app.get('/register', function(req, res){

  res.render("register",{errors:false})

})

app.post('/register', function(req, res){

  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;
  let password2 = req.body.password2;

  //validation

  req.checkBody('username', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);


  var errors = req.validationErrors();

  app.db.query('SELECT `username` FROM `users` WHERE `username` = ?',
  [username,username], (err, results, fields) =>{
    if(results == undefined){
      errors == true;
    }

    if(errors){
      res.render("register",{
        errors:errors
      })

    }else {
      var newUser = {
        username: username,
        email: email,
        password: password,
        permissions: 0
      }

      app.createUser(newUser, user =>{
        app.db.query("INSERT INTO `users` (`username`, `password`, `email`, `permission`) VALUES (?,?,?,?)",
        [user.username,user.password,user.email,user.permissions])
      })


      res.render("login")
    }

  })

})
