const app = require("../main.js").app
const passport = require("../main.js").passport

app.get('/dashboard', app.ensureAuthenticated, function(req, res){
  res.render("dashboard")
})
