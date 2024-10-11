const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bcrypt = require("bcrypt");
const {getRounds} = bcrypt;

const userSchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
            },
            message: props => `${props.value} is not a valid email !`
        },
        required: [true, 'User email required']
    },
    Phone : {
        type: String,
        required: [true, 'User phone required']
    },
    Location : {
        type: String,
    },
    Gender : {
        type: String,
    },
    Image : {
        type: String,
        default: 'default.jpg'
    },
    Password : {
        type: String,
        required: [true, 'User password required'],
    },
    Re_type_Password : {
        type: String,
        required: [true, 'Confirm password required'],
    }
}, {
    timestamps: true,
    versionKey: false
});

const userModel = model("user", userSchema);

module.exports = userModel;