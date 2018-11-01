const app = require("../main.js").app

app.get('/contact', function(req, res){
  res.render("contact")
})
