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
    vaccine: [
        {
            vaccineName: String,
            date: Date
        }
    ],
    positive:[
        {
            date:Date
        }
    ]
})

module.exports = mongoose.model('CovidInfo',covidInfoSchema)