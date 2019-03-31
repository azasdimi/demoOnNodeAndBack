// HLaA24EvtBvqkBcQ

const express = require('express');
const bodyParser = require('body-parser');
// const PostModule = require('./models/post');
const mongoose = require('mongoose');
const postRoutes = require('./routes/posts');

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
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, PUT, DELETE, OPTIONS");

    next();
});

//make express aware of the routes. The "/api/posts" argument focuses only on routes that are targeting the specific path. 
//it basically filters the requests and allows only the ones targeting that path.
app.use("/api/posts",postRoutes);

module.exports = app;