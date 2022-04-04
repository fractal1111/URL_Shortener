const mongoose = require("mongoose");
const  { nanoid } = require('nanoid')


const urlModel = new mongoose.Schema({
  urlCode:{
      type : String,
      required: true,
      lowercase : true,
      trim: true,
      unique: true
  },
  
  
    longUrl: {
      type: String,
      required: true,
      trim : true
  },
    shortUrl:{
        type: String,
        required: true,
        unique : true

    },
  
  isDeleted: {
        type: Boolean,
        default: false
    },
},{timestamps:true});

module.exports = new mongoose.model("urlData", urlModel);