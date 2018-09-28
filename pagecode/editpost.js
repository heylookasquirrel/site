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
      errors:false,
      post:object
    })
  })


})

app.post('/dashboard/editpost', app.ensureAuthenticated, function(req, res){

  let id = req.body.id;
  let title = req.body.title;
  let content = req.body.content;

console.log(req.body)
  req.checkBody('title', 'Title cannot be empty').notEmpty();
  req.checkBody('content', 'Must have some content').notEmpty();

  var errors = req.validationErrors();

  if(errors){

    app.db.query('SELECT * FROM `posts` WHERE `id` = ?', [id] , (err, results, fields) =>{

        let object = {};
        object.id = results[0].id;
        object.title = results[0].title;
        object.content = results[0].content;

      res.render("editpost",{
        page:"posts",
        errors:errors,
        post:object
      })
    })

  }else{
    app.db.query('UPDATE `posts` SET `title` = ?, `content` = ?  WHERE `id` = ?', [title,content,id] , (err, results, fields) =>{

      res.redirect('/dashboard/posts');

    })

  }

})
