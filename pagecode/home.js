const app = require("../main.js").app

app.get('/', function(req, res){

  app.db.query('SELECT * FROM `settings` ' , (err, results, fields) =>{
    if(err){
      console.log(err)
      return
    }


    let object = {};
    object.email = results[0].email;
    object.github = results[0].github;
    object.animation = results[0].animation;
    object.headline = results[0].headline;

    app.db.query('SELECT * FROM `posts` LIMIT 10 ', (err, results, fields) =>{

      if(err){
        console.log(err)
        return
      }

      let posts = [];
      results.forEach( post =>{
        let object = {}
        object.id = post.id;
        object.title = post.title;
        object.content = post.content;
        posts.push(object);
      })
        res.render("home",{
          settings:object,
          posts:posts
        })
    })

  })



})
