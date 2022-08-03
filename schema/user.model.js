const {Schema,model} = require('mongoose')

const USER =  new Schema({
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    DOJ:{
        type:Date,
        required:true
    },
    rooms:[],
})

module.exports = model("USER",USER)