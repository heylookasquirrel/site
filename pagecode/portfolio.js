const app = require("../main.js").app

app.get('/portfolio', function(req, res){

  app.db.query('SELECT * FROM `portfolio` ', (err, results, fields) =>{

    if(err){
      console.log(err)
      return
    }

    let projects = [];
    results.forEach( project =>{
      let object = {}
      object.id = project.id;
      object.title = project.title;
      object.language = project.language;
      object.image = project.image;
      projects.push(object);
    })
      res.render("portfolio",{
        projects:projects
      })
  })


})
