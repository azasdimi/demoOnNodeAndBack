const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true }
});

//The first argument in a plural will be the name of the collections inside our db
module.exports = mongoose.model("Post", postSchema);
