const app = require("../main.js").app
const passport = require("../main.js").passport

app.get('/dashboard', app.ensureAuthenticated, function(req, res){


  app.db.query('SELECT COUNT(*) FROM `posts`', (err, results, fields) =>{

    let totalPosts = results[0]
    totalPosts = totalPosts[fields[0].name]

    let stats = {}
    stats.totalPosts = totalPosts
    res.render("dashboard",{
      page:"overview",
      stats:stats
    })
  })


})

app.get('/dashboard/overview', app.ensureAuthenticated, function(req, res){
  res.redirect('/dashboard');
})
