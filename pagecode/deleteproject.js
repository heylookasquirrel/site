const app = require("../main.js").app
const passport = require("../main.js").passport

app.get('/dashboard/deleteproject', app.ensureAuthenticated, function(req, res){

  let id = req.query.id

  app.db.query('SELECT * FROM `portfolio` WHERE `id` = ?', [id] , (err, results, fields) =>{

      let object = {};
      object.id = results[0].id;
      object.title = results[0].title;
      object.description = results[0].description;



    res.render("deleteproject",{
      page:"posts",
      errors:false,
      project:object
    })
  })


})

app.post('/dashboard/deleteproject', app.ensureAuthenticated, function(req, res){

  let id = req.body.id;

  app.db.query('DELETE FROM `portfolio` WHERE `id` = ?', [id] , (err, results, fields) =>{

      res.redirect('/dashboard/projects');

  })



})
