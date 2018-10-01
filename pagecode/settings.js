const app = require("../main.js").app
const passport = require("../main.js").passport
const path = require("path")

app.get('/dashboard/settings', app.ensureAuthenticated, function(req, res){

  app.db.query('SELECT * FROM `settings` ' , (err, results, fields) =>{

    let object = {};
    object.email = results[0].email;
    object.github = results[0].github;
    object.animation = results[0].animation;
    object.headline = results[0].headline;

    res.render("settings",{
        page:"settings",
        settings:object,
        errors:false,
    })

  })

})

app.post('/dashboard/settings', app.ensureAuthenticated, function(req, res){

  let email = req.body.email || null;
  let github = req.body.github || null;
  let headline = req.body.headline || null;
  let animation = req.body.animation || null;

  let headerImg = null;
  if (Object.keys(req.files).length === 1){
    thumbnail = req.files.headerImg;
  }

  req.checkBody('email', 'Email cannot be empty').notEmpty();
  req.checkBody('headline', 'Must have a headline').notEmpty();

  var errors = req.validationErrors();

  if(errors){

    res.render("settings",{
        page:"settings",
        errors:errors,
    })

  }else{

    let filename = null;
    if (Object.keys(req.files).length === 1){

      let normalizedPath = require("path").join(__dirname, "../public/img/header1.png")
      thumbnail.mv(normalizedPath + filename, err =>{
        console.log(err)
        app.db.query('UPDATE `settings` SET `email` = ?, `github` = ?,`headline` = ?,`animation` = ?',
        [email,github,headline,animation] , (err, results, fields) =>{
          console.log(err)
          res.redirect('/dashboard/settings');
        })
      })
    }else{
      app.db.query('UPDATE `settings` SET `email` = ?, `github` = ?,`headline` = ?,`animation` = ?',
      [email,github,headline,animation] , (err, results, fields) =>{
        console.log(err)
        res.redirect('/dashboard/projects');
      })
    }
  }
})
