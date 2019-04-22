const express = require("express");
const multer = require("multer");

const router = express.Router();
const PostModule = require("../models/post");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  //destination is a function that is executed whenever the user wants to save a file
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mimetype");
    if (isValid) {
      error = null;
    }
    cb(error, "server/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "_" + Date.now() + "." + ext);
  }
});

//store data in Database
//we pass the multer configuration with multer(storage) and single means that i am expecting a single file and will try to find
//in the image property in the request body
router.post(
  "",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    //construct url to our server
    const url = req.protocol + "://" + req.get("host");
    // const post = req.body;
    const post = new PostModule({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename //file is provided from the multer
    });
    //create the right query for the db with the data that "post" has and the automatically generated id into the db
    post.save().then(createdPost => {
      //along with success message we also get the id of the post and save it
      res.status(201).json({
        message: "Post added successfully",
        // post: {
        //   id: createdPost._id,
        //   title: createdPost.title,
        //   content: createdPost.content,
        //   imagePath: createdPost.imagePath
        // }

        //this is the same as the commented above section. We are using a next gen JS feature where you create a object and
        //then you use the spread operator(...createdPost) to copy all properties of another object and you simply add or
        //override some selected features (id).
        post: {
          ...createdPost,
          id: createdPost._id
        }
      });
    });
    // console.log(post);
  }
);

//ways to update content in a database using http requests
//- router.put(): Puts a new resource and completely remove the old one
//- router.patch(): Updates an existing resource with new values
router.put(
  "/:id",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new PostModule({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath
    });
    console.log(post);
    //updateOne first takes the JS object which narrows down which one to update
    PostModule.updateOne({ _id: req.params.id }, post).then(result => {
      // console.log(result);
      res.status(200).json({ message: "Update Successfull!" });
    });
  }
);

//fetching data from the db
router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize; //the + in front will transform the value from string to number
  const currentPage = +req.query.page;
  const postQuery = PostModule.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize); //skip will not retrieve all posts but it will skip all the posts until the number provided
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return PostModule.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
      });
    });
});

router.get("/:id", (req, res, next) => {
  //mongoose looks in the db for an element with the id provided
  PostModule.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});

//delete data from the db
//bcs we can't define routes for all possible id, we add a dynamic path segment ":id" (id can be changed to whatever we want)
router.delete("/:id", (req, res, next) => {
  //req.params.id express property which gives you access to all encoded parameters of req
  PostModule.deleteOne({ _id: req.params.id }).then(result => {
    //_id is how it saved in the db
    console.log(result);
    res.status(200).json({ message: "Post Deleted!" });
  });
});

module.exports = router;
