const app = require("../main.js").app
const passport = require("../main.js").passport

app.get('/dashboard/posts', app.ensureAuthenticated, function(req, res){


  app.db.query('SELECT * FROM `posts`;', (err, results, fields) =>{
    let posts = []

    results.forEach( post => {
      let object = {};
      object.id = post.id;
      object.title = post.title;
      object.content = post.content.substring(0,100) + "...";
      posts.push(object)
    })

    res.render("posts",{
      page:"posts",
      posts:posts
    })
  })


})
