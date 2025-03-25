import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const charSchema = new Schema({
    name: {
        type: String,
        required: [true, "A character must have a name"],
        lowercase: true,
        min: [2, "A name must be at least 2 characters long"],
        max: [70, "A name must be at most 70 characters long"],
    },
    level: {
        type: Number,
        default: 1,
        min: [1, "The minimum level of a character must be 1"],
        max: [60, "The maximum level of a character must be 60"],
    },
    health: {
        current: {
            type: Number,
            default: 100,
            min: [0, "A character's health cannot go below 0"],
        },
        maximum: {
            type: Number,
            default: 100,
            min: [1, "A character's maximum health must be above 0"],
        },
    },
    mana: {
        current: {
            type: Number,
            default: 100,
            min: [0,"A character's mana cannot go below 0"],
        },
        maximum: {
            type: Number,
            default: 100,
            min: [1, "A character's maximum mana must be above 0"],
        },
    },
    experience: {
        current: {
            type: Number,
            default: 0,
            min: [0, "A character cannot have negative experience"],
        },
        maximum: {
            type: Number,
            default: 100,
            min: [1, "A character's maximum experience must be above 0"],
        }
    },
});

charSchema.pre("save", (next) => {
    next();
});
export default model("Character", charSchema, "characters");