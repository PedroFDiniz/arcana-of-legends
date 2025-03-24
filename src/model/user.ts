import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'An email is required'],
        match: [/^\S+@\w+([.-]?\w+)(.\w{2,3})+$/, 'Invalid email format'],
        lowercase: true,
        unique: [true, 'That email address is already present in our database'],
        max: [255, 'The email field has a maximum size of 255'],
    },
    password: {
        type: String,
        required: [true, 'A user must have a password'],
        min: [5, 'The password field must have a minimum length of 5 characters'],
    },
    accessLevel: {
        type: String,
        enum: ['admin', 'player', 'banned'],
        default: 'player',
    },
    emailConfirmed: {
        type: Boolean,
        default: false,
    }
});

userSchema.pre('save', (next) => {
    next();
});
export default model('User', userSchema, 'users');
