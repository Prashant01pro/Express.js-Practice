import mongoose from "mongoose";
const userschema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
    age: mongoose.Schema.Types.Int32,
    value: mongoose.Schema.Types.Int32,
    password: {
        type: mongoose.Schema.Types.String,
        required: true
    }
})

export const User=mongoose.model("client",userschema)