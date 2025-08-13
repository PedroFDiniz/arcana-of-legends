import { model, Schema } from "mongoose";

type ID = Schema.Types.ObjectId;

interface IUser {
    _id: ID;
    username: string;
    email: string;
    password: string;
    accessLevel: string;
    confirmationCode: number;
    emailConfirmed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: [true, "The username field is required"],
        unique: true,
        match: [/^[a-zA-Z](([ ]|[.]|[-])?[\w])*$/, "Invalid username format"],
        min: [3, "Username cannot be smaller than 3 alphanumeric characters"],
        max: [50, "Username cannot be bigger than 50 alphanumeric characters"],
    },
    email: {
        type: String,
        required: [true, "The email field is required"],
        match: [/^\S+@\w+([.-]?\w+)(.\w{2,3})+$/, "Invalid email format"],
        lowercase: true,
        unique: [true, "That email address is already present in our database"],
        max: [255, "The email field has a maximum size of 255"],
    },
    password: {
        type: String,
        required: [true, "A user must have a password"],
        min: [5, "The password field must have a minimum length of 5 characters"],
    },
    accessLevel: {
        type: String,
        enum: ["admin", "moderator", "player", "banned"],
        default: "player",
    },
    confirmationCode: {
        type: Number,
        required: true,
    },
    emailConfirmed: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    updatedAt: {
        type: Date,
    },
});

export default model("User", userSchema, "users");
export { IUser };
