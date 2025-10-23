import mongoose from "mongoose";
const discordUserSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
    age: mongoose.Schema.Types.Int32,
    value: mongoose.Schema.Types.Int32,
    discordId: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique:true
    }
})

export const DiscordUser=mongoose.model("DiscordClient",discordUserSchema);