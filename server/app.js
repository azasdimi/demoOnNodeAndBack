// HLaA24EvtBvqkBcQ
//IF THIS ERROR, ADD IP TO MONGO ATLAS IP WHITELIST
// Connection failed.
// { MongoNetworkError: connection 4 to cluster0-shard-00-02-bodvh.mongodb.net:27017 closed
//     at TLSSocket.<anonymous> (/Users/dimitrios.azas-cic.netherlandsibm.com/Desktop/Projects/Training/angular-session/demoOnNodeAndBack/node_modules/mongodb-core/lib/connection/connection.js:276:9)
//     at Object.onceWrapper (events.js:255:19)
//     at TLSSocket.emit (events.js:165:20)
//     at _handle.close (net.js:562:12)
//     at TCP.done [as _onclose] (_tls_wrap.js:379:7)
//   name: 'MongoNetworkError',
//   errorLabels: [ 'TransientTransactionError' ],
//   [Symbol(mongoErrorContextSymbol)]: {} }

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
// const PostModule = require('./models/post');
const mongoose = require("mongoose");
const postRoutes = require("./routes/posts");

const app = express();

//node-angular-db is the name of the db. Connect function will create automatically the db the first time it runs
mongoose
  .connect(
    "mongodb+srv://dimitris:HLaA24EvtBvqkBcQ@cluster0-bodvh.mongodb.net/node-angular-db?retryWrites=true",
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("Connected to database.");
  })
  .catch(err => {
    console.log("Connection failed.");
    console.log(err);
  });

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://dimitris:<password>@cluster0-bodvh.mongodb.net/test?retryWrites=true";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//middleware built into express. it will apply to any request that have "/images" inside and the static middleware which will
//alow any request with /images to continue
app.use("/images", express.static(path.join("server/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );

  next();
});

//make express aware of the routes. The "/api/posts" argument focuses only on routes that are targeting the specific path.
//it basically filters the requests and allows only the ones targeting that path.
app.use("/api/posts", postRoutes);

module.exports = app;
