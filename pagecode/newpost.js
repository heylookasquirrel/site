const app = require("../main.js").app
const passport = require("../main.js").passport

app.get('/dashboard/newpost', app.ensureAuthenticated, function(req, res){

  res.render("newpost",{
      page:"posts",
      errors:false,
  })


})

app.post('/dashboard/newpost', app.ensureAuthenticated, function(req, res){

  let title = req.body.title;
  let content = req.body.content;

  req.checkBody('title', 'Title cannot be empty').notEmpty();
  req.checkBody('content', 'Must have some content').notEmpty();

  var errors = req.validationErrors();

  if(errors){

    res.render("newpost",{
        page:"posts",
        errors:errors,

    })

  }else{
    app.db.query('INSERT INTO  `posts` (`title`,`content`) VALUES (?,?)', [title,content] , (err, results, fields) =>{

      console.log(err)
      res.redirect('/dashboard/posts');

    })

  }

})
