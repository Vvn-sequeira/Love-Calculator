const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const LoveSchema =  new Schema( {
    boy: {
      type: String,   
      require: true,
    },
    girl:{
      type: String, 
      require: true,  
    },
})

module.exports = mongoose.model("Love" , LoveSchema);