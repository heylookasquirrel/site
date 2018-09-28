const app = require("../main.js").app
const passport = require("../main.js").passport

app.get('/dashboard/editpost', app.ensureAuthenticated, function(req, res){

  let id = req.query.id

  app.db.query('SELECT * FROM `posts` WHERE `id` = ?', [id] , (err, results, fields) =>{

      let object = {};
      object.id = results[0].id;
      object.title = results[0].title;
      object.content = results[0].content;



    res.render("editpost",{
      page:"posts",
      post:object
    })
  })


})
