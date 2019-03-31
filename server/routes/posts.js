const express = require('express');

const router = express.Router();
const PostModule = require('../models/post');

//store data in Database
router.post("", (req, res, next) => {
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

//ways to update content in a database using http requests
//- router.put(): Puts a new resource and completely remove the old one 
//- router.patch(): Updates an existing resource with new values
router.put("/:id", (req,res,next) => {
    const post = new PostModule({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    //updateOne first takes the JS object which narrows down which one to update
    PostModule.updateOne({_id: req.params.id}, post).then( result => {
        // console.log(result);
        res.status(200).json({ message: "Update Successfull!" });
    })
});

//fetching data from the db
router.get("",(req,res, next) => {
    PostModule.find()
        .then(documents => {
            res.status(200).json({
                message: 'Posts fetched successfully!',
                posts: documents
            });
        });
});

router.get("/:id", (req,res,next) => {
    //mongoose looks in the db for an element with the id provided
    PostModule.findById(req.params.id).then(post => {
        if (post){
            res.status(200).json(post);
        }
        else{
            res.status(404).json( {message: "Post not found!"});
        }
    })
})

//delete data from the db 
//bcs we can't define routes for all possible id, we add a dynamic path segment ":id" (id can be changed to whatever we want)
router.delete("/:id", (req, res, next) => {
    //req.params.id express property which gives you access to all encoded parameters of req
    PostModule.deleteOne({_id: req.params.id}).then(result => { //_id is how it saved in the db
        console.log(result);
        res.status(200).json({ message: "Post Deleted!"}); 
    });
});

module.exports = router;