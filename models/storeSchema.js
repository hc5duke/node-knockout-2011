var mongoose = require('mongoose'),
    ProductSchema = new mongoose.Schema({
      name: {type: String}
    });

module.exports = new mongoose.Schema({
  name: {type: String, index: true},
  postal_code: {type: String, index: true},
  products: [ProductSchema]
});
