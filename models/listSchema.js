var mongoose = require('mongoose'),
    ProductSchema = new mongoose.Schema({
      name: {type: String}
    });

module.exports = new mongoose.Schema({
  user: {type: String, index: true},
  products: [ProductSchema]
});
