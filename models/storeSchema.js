var mongoose = require('mongoose'),
    ProductSchema = new mongoose.Schema({
      name: {type: String}
    });

module.exports = new mongoose.Schema({
  _id: {type: mongoose.Schema.ObjectId, index: true, unique: true},
  name: {type: String, index: true},
  postal_code: {type: String, index: true},
  products: [ProductSchema]
});
