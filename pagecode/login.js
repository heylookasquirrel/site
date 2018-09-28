const app = require("../main.js").app
const passport = require("../main.js").passport

app.post('/login', passport.authenticate('local', { successRedirect: '/dashboard', failureRedirect: '/login', failureFlash: false }),
	function (req, res) {
	res.redirect('/');
})

app.get('/login', function(req, res){
  res.render("login")
})

app.get('/logout', function (req, res) {
  req.session.destroy()
	req.logout();
  res.redirect('/login');
});
