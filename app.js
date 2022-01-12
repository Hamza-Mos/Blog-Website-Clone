//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Start writing blogs using the \"COMPOSE A MESSAGE\" button in the navigation bar!";

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", (req, res) => 
{

  Post.find({}, (err, posts) => {
    res.render("home", 
    {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", (req, res) => 
{
  res.render("compose");
});

app.post("/compose", (req, res) => 
{
  const post = new Post
  ({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save((err) => 
  {
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", (req, res) => 
{

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, (err, post) => 
  {
    res.render("post", 
    {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", (req, res) => 
{
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", (req, res) => 
{
  res.render("contact", {contactContent: contactContent});
});


app.listen(process.env.PORT, () => 
{
  console.log("Server started on port 3000");
});
