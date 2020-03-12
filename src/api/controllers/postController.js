const Post = require('../models/postModel');

exports.list_all_post = (req, res) => {
  Post.find({}, (error, posts) => {
    if(error){
      res.status(500);
      console.log(error);
      res.json({message: "Erreur serveur."})
    }
    else{
      res.status(200);
      res.json(posts)
    }
  })
}

exports.create_a_post = (req, res) => {
  let new_post = new Post(req.body);

  new_post.save((error, post) => {
    if(error){
      res.status(500);
      console.log(error);
      res.json({message: "Erreur serveur."})
    }
    else{
      res.status(201);
      res.json(post);
    }
  })
}

exports.get_a_post = (req, res) => {
  // let post_id = req.params.post_id;
  let {post_id} = req.params;

  // Post.findOne({_id : post_id}, (error, posts) => {
  Post.findById(post_id, (error, post) => {
    if(error){
      res.status(500);
      console.log(error);
      res.json({message: "Erreur serveur."})
    }
    else{
      res.status(200);
      res.json(post)
    }
  })
}
