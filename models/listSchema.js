var mongoose = require('mongoose'),
    ProductSchema = new mongoose.Schema({
      name: {type: String}
    });

module.exports = new mongoose.Schema({
  _id: {type: mongoose.Schema.ObjectId, index: true, unique: true},
  user: {type: String, index: true},
  products: [ProductSchema]
});
