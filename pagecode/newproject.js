const app = require("../main.js").app
const passport = require("../main.js").passport
const path = require("path")

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
  if (Object.keys(req.files).length === 1){
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
    if (Object.keys(req.files).length === 1){

      let number = Math.floor(Math.random() * 9999);
      filename = number + thumbnail.name;
      let normalizedPath = require("path").join(__dirname, "../public/img/projects/")
      thumbnail.mv(normalizedPath +  filename, err =>{
        console.log(err)
        app.db.query('INSERT INTO `portfolio` (`title`,`description`,`link`,`language`,`git`,`image`) VALUES (?,?,?,?,?,?)',
        [title,description,link,language,git,filename] , (err, results, fields) =>{
          console.log(err)
          res.redirect('/dashboard/projects');
        })

      })

    }else{
      app.db.query('INSERT INTO `portfolio` (`title`,`description`,`link`,`language`,`git`,`image`) VALUES (?,?,?,?,?,?)',
      [title,description,link,language,git,filename] , (err, results, fields) =>{
        console.log(err)
        res.redirect('/dashboard/projects');
      })
    }





  }

})
