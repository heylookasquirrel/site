const express = require('express');
const fs = require("fs");
const app = express();
const bodyParser = require("body-parser");
const http = require('http').Server(app);
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs")
const mysql = require('mysql2');
const settings = require("./settings.json")
const passport = require("passport");
app.db = mysql.createConnection({
    host:settings.mysqlhost,
    user:settings.mysqluser,
    database:settings.mysqldb,
    password:settings.mysqlpassword
})

app.set('view engine','ejs');
app.use("/", express.static("public"));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator())

app.use(session({
  secret:'X2w`ar(Umqd3PBAA',
  saveUninitialized: true,
  resave:true
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
  //checks if session is created
  if(req.session.passport != undefined){
    //if created checks if logged in
    if( req.session.passport.user != undefined ){
      res.locals.permissions = req.session.passport.user.permissions
      next()
    }else{
        res.locals.permissions = -1
        next()
    }
  }else
  //session was logged out
  {

      res.locals.permissions = -1
      next()
  }
})

app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

http.listen(80, function(){
  init()
  console.log('listening on port:80');
});

//checks if your logged in
app.ensureAuthenticated = (req, res, next)=>{
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/login');
	}
}
//checks admin permissions
app.isAdmin = (req, res, next)=> {
  if(req.session.passport.user.permissions == ADMIN_PERMISSION){
    return next();
  } else {
    res.redirect('/music');
  }
}
//checks moderator permissions
app.isModerator = (req, res, next)=> {
  if(req.session.passport.user.permissions >= MODERATOR_PERMISSION){
    return next();
  } else {
    res.redirect('/music');
  }
}

app.createUser = (newUser, callback) =>{
  bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        callback(newUser)
	    });
	});
}

app.getUser = (username, callback) =>{
  app.db.query('SELECT * FROM `users` WHERE `username` = ?',
  [username,username], (err, results, fields) =>{
    if(results == undefined|| results.length == 0) {
       callback(null, {
         username: "0",
         userid: "0",
         password: "0",
       });
       return
    }
    let username = results[0].username || 0;
    let userid = results[0].id || 0 ;
    let password = results[0].password || 0;
    let permissions = results[0].permission || 0;

    let user = {
      username:username,
      userid: userid,
      password: password,
      permissions: permissions
    }
    callback(null, user);
  })
}

app.comparePassword = (password, hash, callback)=>{
  bcrypt.compare(password, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}


passport.use(new LocalStrategy(
	 (username, password, done) => {
		app.getUser(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			app.comparePassword(password, user.password, (err, isMatch) => {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
  let serialized = {}
  serialized.username = user.username;
  serialized.userid = user.userid;
  serialized.permissions = user.permissions;
	done(null, serialized);
});

passport.deserializeUser(function (id, done) {
	app.getUser(id, function (err, user) {
		done(err, user);
	});
});

module.exports = { app, passport};
init()


function init(){
  //Looks for each js file in the pagecode folder
  let normalizedPath = require("path").join(__dirname, "pagecode");
  fs.readdirSync(normalizedPath).forEach(function(file) {
    console.log("loaded " + file)
    require("./pagecode/" + file);
  });
}
