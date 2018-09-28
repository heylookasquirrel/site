const app = require("../main.js").app
const passport = require("../main.js").passport

app.get('/dashboard/newproject', app.ensureAuthenticated, function(req, res){

  res.render("newproject",{
      page:"projects",
      errors:false,
  })


})

app.post('/dashboard/newproject', app.ensureAuthenticated, function(req, res){

  let title = req.body.title || null;
  let description = req.body.description || null;
  let link = req.body.link || null;
  let language = req.body.language || null;
  let git = req.body.git || null;

  let thumbnail = null;
  if (!req.files){

  }else{

    thumbnail = req.files.image;
  }

  req.checkBody('title', 'Title cannot be empty').notEmpty();
  req.checkBody('description', 'Must have a description').notEmpty();

  var errors = req.validationErrors();

  if(errors){

    res.render("newproject",{
        page:"projects",
        errors:errors,
    })

  }else{

    let filename = null;

    if (!req.files){
      app.db.query('INSERT INTO `portfolio` (`title`,`description`,`link`,`language`,`git`,`image`) VALUES (?,?,?,?,?,?)',
      [title,description,link,language,git,filename] , (err, results, fields) =>{
        console.log(err)
        res.redirect('/dashboard/projects');
      })

    }else{
      filename = thumbnail.name;
      console.log(filename)
      thumbnail.mv('/public/img/projects/' + thumbnail.name, err =>{

      })

      app.db.query('INSERT INTO `portfolio` (`title`,`description`,`link`,`language`,`git`,`image`) VALUES (?,?,?,?,?,?)',
      [title,description,link,language,git,filename] , (err, results, fields) =>{
        console.log(err)
        res.redirect('/dashboard/projects');
      })

    }





  }

})
