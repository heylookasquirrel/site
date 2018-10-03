const app = require("../main.js").app
const passport = require("../main.js").passport
const path = require("path")

app.get('/dashboard/editproject', app.ensureAuthenticated, function(req, res){

  let id = req.query.id

  app.db.query('SELECT * FROM `portfolio` WHERE `id` = ?', [id] , (err, results, fields) =>{

      let object = {};
      object.id = id;
      object.title = results[0].title;
      object.description = results[0].description;
      object.link= results[0].link;
      object.git = results[0].git;
      object.language = results[0].language;

    res.render("editproject",{
      page:"posts",
      errors:false,
      project:object
    })
  })


})

app.post('/dashboard/editproject', app.ensureAuthenticated, function(req, res){

  let title = req.body.title || null;
  let description = req.body.description || null;
  let link = req.body.link || null;
  let language = req.body.language || null;
  let git = req.body.git || null;
  let id = req.body.id || null;

  let thumbnail = null;
  if (Object.keys(req.files).length === 1){
    thumbnail = req.files.image;
  }
  req.checkBody('title', 'Title cannot be empty').notEmpty();
  req.checkBody('description', 'Must have a description').notEmpty();

  var errors = req.validationErrors();

  if(errors){

    res.render("editproject",{
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
        app.db.query('UPDATE `portfolio` SET `title` = ?, `description` = ?, `link` = ?,`language` = ?,`git` = ?,`image` = ?) WHERE `id` = ?',
        [title,description,link,language,git,filename,id] , (err, results, fields) =>{
          console.log(err)
          res.redirect('/dashboard/projects');
        })
      })
    }else{
      app.db.query('UPDATE `portfolio` SET `title` = ?, `description` = ?, `link` = ?,`language` = ?,`git` = ?,`image` = ?) WHERE `id` = ?',
      [title,description,link,language,git,filename,id] , (err, results, fields) =>{
        console.log(err)
        res.redirect('/dashboard/projects');
      })
    }
  }
})
