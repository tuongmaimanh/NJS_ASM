const mongoose = require('mongoose')
const Schema = mongoose.Schema

const covidInfoSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    date:{
        type : Date, default: Date.now 
    },
    temperature:[
        {
        date: Date,
        temp:Number,
        }
    ]
    ,
    vaccine: [
        {
            vaccine: String,
            date: Date
        }
    ],
    infected:[
        {
            date:Date,
            methodTest:Array,
            note:String
        }
    ]
})

module.exports = mongoose.model('CovidInfo',covidInfoSchema)