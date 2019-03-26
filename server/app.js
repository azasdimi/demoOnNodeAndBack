// HLaA24EvtBvqkBcQ

const express = require('express');
const bodyParser = require('body-parser');
const PostModule = require('./models/post');
const mongoose = require('mongoose');

const app = express();

//node-angular-db is the name of the db. Connect function will create automatically the db the first time it runs
mongoose.connect("mongodb+srv://dimitris:HLaA24EvtBvqkBcQ@cluster0-bodvh.mongodb.net/node-angular-db?retryWrites=true")
    .then(() => {
        console.log('Connected to database.');
    })
    .catch(() => {
        console.log('Connection failed.');
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, DELETE, OPTIONS");

    next();
});

//store data in Database
app.post("/api/posts", (req, res, next) => {
    // const post = req.body;
    const post = new PostModule({
        title: req.body.title,
        content: req.body.content
    });
    //create the right query for the db with the data that "post" has and the automatically generated id into the db
    post.save().then(createdPost => { //along with success message we also get the id of the post and save it
        res.status(201).json({
            message: "Post added successfully",
            postId: createdPost._id
        });
    });
    // console.log(post);
    
});

//fetching data from the db
app.get('/api/posts',(req,res, next) => {
    PostModule.find()
        .then(documents => {
            res.status(200).json({
                message: 'Posts fetched successfully!',
                posts: documents
            });
        });
});

//delete data from the db 
//bcs we can't define routes for all possible id, we add a dynamic path segment ":id" (id can be changed to whatever we want)
app.delete("/api/posts:id", (req, res, next) => {
    //req.params.id express property which gives you access to all encoded parameters of req
    PostModule.deleteOne({_id: req.params.id}).then(result => { //_id is how it saved in the db
        console.log(result);
        res.status(200).json({ message: "Post Deleted!"}); 
    });
});

module.exports = app;