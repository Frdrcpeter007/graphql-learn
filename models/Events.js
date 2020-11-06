const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const event = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    date: {
        type: Date,
        required: true,
        default: new Date().toISOString()
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Events', event);