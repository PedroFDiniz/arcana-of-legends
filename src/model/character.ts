import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const charSchema = new Schema({
    name: {
        type: String,
        required: [true, "Character must have a name"],
        lowercase: true,
        min: [2, "A name must be at least 2 characters long"],
        max: [70, "A name must be at most 70 characters long"],
    },
    level: {
        type: Number,
        default: 1,
        min: 1,
        max: 60,
    },
    health: {
        current: {
            type: Number,
            default: 100,
            min: 0,
        },
        maximum: {
            type: Number,
            default: 100,
            min: 1,
        },
    },
    mana: {
        current: {
            type: Number,
            default: 100,
            min: 0,
        },
        maximum: {
            type: Number,
            default: 100,
            min: 1,
        },
    },
    experience: {
        current: {
            type: Number,
            default: 0,
            min: 0,
        },
        maximum: {
            type: Number,
            default: 100,
            min: 1,
        }
    },
});

charSchema.pre("save", (next) => {
    next();
});
export default model("Character", charSchema, "characters");