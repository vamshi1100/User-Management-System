const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username cannot be empty']
    },
    password: {
        type: String,
        required: [true, 'password cannot be empty']
    }

})

module.exports = mongoose.model('Admin', adminSchema);