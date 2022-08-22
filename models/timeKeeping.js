const mongoose = require('mongoose')
const Schema = mongoose.Schema

const timeKeepingSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    date:{
        type : Date, default: new Date().toLocaleDateString() ,
    },
    detail:[
        {
            checkIn: Date,
            checkOut: Date,
            workplace: {type: String, required: true}

        }
    ],
    
})

module.exports = mongoose.model('TimeKeeping', timeKeepingSchema)