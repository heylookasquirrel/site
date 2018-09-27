const app = require("../main.js").app

app.get('/', function(req, res){

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
        posts:posts
      })
  })


})
