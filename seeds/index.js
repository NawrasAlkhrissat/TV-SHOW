const shows = require('./shows.js');
const mongoose = require('mongoose');
const showModel = require('../models/showModel.js');

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/TV-Show');
  console.log("DB Connected");
}

const seedDB = async ()=>{
    //await showModel.deleteMany({});
    for(let i =0; i<=5;i++){
        await new showModel({  
            name: shows.horror[i].name,
            language: shows.horror[i].language,
            image: shows.horror[i].image,
            url: shows.horror[i].url,
            type: shows.horror[i].type,
            dis : shows.horror[i].dis
    }).save();
    }
}
seedDB().then(()=>{
    mongoose.connection.close();
})
