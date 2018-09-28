const app = require("../main.js").app
const passport = require("../main.js").passport

app.get('/dashboard/projects', app.ensureAuthenticated, function(req, res){


  app.db.query('SELECT * FROM `portfolio`', (err, results, fields) =>{
    let projects = []

    results.forEach( project => {
      let object = {};
      object.id = project.id;
      object.title = project.title;
      object.description = project.description.substring(0,50) + "...";
      object.link = project.link;
      object.language = project.language;
      object.git = project.git;
      projects.push(object)
    })

    res.render("projects",{
      page:"projects",
      projects:projects
    })
  })


})
