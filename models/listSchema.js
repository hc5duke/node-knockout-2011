var mongoose = require('mongoose'),
    ProductSchema = new mongoose.Schema({
      name: {type: String}
    });
module.exports = ListSchema = new mongoose.Schema({
  _id: mongoose.Schema.ObjectId,
  user: {type: String},
  products: [ProductSchema]
});
