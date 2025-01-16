const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const showSchema = new Schema({
    name: String,
    language: String,
    image: String,
    url: String,
    type: String,
    dis : String
})
module.exports = mongoose.model('Show', showSchema);