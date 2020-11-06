const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Users = new Schema({
    email: {type: String, required: true},
    password: {type: String},
    createdEvent: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Events'
        }
    ]
},{
    timestamps: true
});

module.exports = mongoose.model('Users', Users);