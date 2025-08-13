import { DeleteResult } from "mongoose";
import Users, { IUser } from "../model/user";

const USER_STANDARD_PROPS = "_id username email accessLevel";
const USER_LOGIN_PROPS = "_id username email password accessLevel";
const LANGUAGE = "pt-BR";

type usernameOrEmail = string;

export type userCreateProps = {
    username: string;
    email: string;
    password: string;
};

export type userUpdateProps = {
    username?: string;
    email?: string;
    password?: string;
};

async function create(properties: userCreateProps): Promise<IUser> {
    const newUser = new Users({
        username: properties.username,
        email: properties.email,
        password: properties.password,
        createdAt: new Date().toLocaleString(LANGUAGE),
    });
    return newUser.save();
}

async function destroy(id: string): Promise<DeleteResult> {
    const user = Users.findById(id);
    return user.deleteOne().exec();
}

async function destroyMany(emails: string[]): Promise<DeleteResult> {
    const users = Users.find({
        email: {
            $in: emails,
        },
    });
    return users.deleteMany().exec();
}

async function exists(id: string): Promise<boolean> {
    const exists = Users.exists({ _id: id });
    return (!!exists.exec());
}

async function has(email: string): Promise<boolean> {
    const exists = Users.exists({ email });
    const result = (!!exists.exec());
    return result;
}

async function getLoginInfo
(credentials: usernameOrEmail, password: string): Promise<IUser | null> {
    const user = Users.findOne({
        $or: [
            { username: credentials },
            { email: credentials },
        ],
    });
    user.select(USER_LOGIN_PROPS);
    return user.exec();
}

async function read(id: string): Promise<IUser | null> {
    const user = Users.findOne({ _id: id });
    user.select(USER_STANDARD_PROPS);
    return user.exec();
}

async function readAll(): Promise<IUser[]> {
    const users =  Users.find();
    users.select(USER_STANDARD_PROPS);
    return users.exec();
}

async function readByEmail(email: string): Promise<IUser | null> {
    const user = Users.findOne({
        email
    });
    user.select(USER_STANDARD_PROPS);
    return user.exec();
}

async function update
(id: string, properties: userUpdateProps): Promise<IUser | null> {
    const user = Users.findOne({ _id: id })
    user.select("_id username email password");
    if (properties.username) user.set("username", properties.username);
    if (properties.email) user.set("email", properties.email);
    if (properties.password) user.set("password", properties.password);
    return user.exec();
}

export default {
    create,
    destroy,
    destroyMany,
    exists,
    has,
    read,
    readAll,
    readByEmail,
    update,
};
