const mongoose = require('mongoose')
const Schema = mongoose.Schema

const leaveSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    dayLeave: {
         type : Array,
    },
    hourLeave:{
        date: Date,
        hours: Number
    },
    reason:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Leave',leaveSchema)