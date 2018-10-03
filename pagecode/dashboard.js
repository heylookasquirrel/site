const app = require("../main.js").app
const passport = require("../main.js").passport

app.get('/dashboard', app.ensureAuthenticated, function(req, res){


  app.db.query('SELECT COUNT(*) FROM `posts`', (err, results, fields) =>{

    let totalPosts = results[0]
    totalPosts = totalPosts[fields[0].name]

    let stats = {}
    stats.totalPosts = totalPosts

    app.db.query('SELECT COUNT(*) FROM `portfolio`', (err, results, fields) =>{

      stats.totalProjects = results[0]
      stats.totalProjects = stats.totalProjects[fields[0].name]

      app.db.query('SELECT * FROM `analytics`', (err, results, fields) =>{

        let object = []

        results.forEach( page => {
          object.push(page);
        })

        stats.pages = object;

        res.render("dashboard",{
          page:"overview",
          stats:stats
        })

      })
    })
  })


})

app.get('/dashboard/overview', app.ensureAuthenticated, function(req, res){
  res.redirect('/dashboard');
})
