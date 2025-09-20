import { DeleteResult } from "mongoose";
import Users, { IUser, IUserDraft } from "../model/user";
import { createConfirmationCode } from "../utils/misc";
import { log } from "../utils/misc";

const USER_STANDARD_PROPS = "_id username email accessLevel";
const USER_LOGIN_PROPS = "_id email password";
const LANGUAGE = "pt-BR";

type userOrEmail = string;
type CharacterSearchResult = IUserDraft | null;

export interface UserCreateProps {
    username: string;
    email: string;
    password: string;
};

export interface UserUpdateProps extends Partial<UserCreateProps> { };

async function create(properties: UserCreateProps): Promise<IUser> {
    const newUser = await Users.create({
        username: properties.username,
        email: properties.email,
        password: properties.password,
        confirmationCode: createConfirmationCode(),
    });
    return newUser;
}

async function destroy(id: string): Promise<DeleteResult> {
    const user = Users.findById(id);
    return await user.deleteOne().exec();
}

async function destroyMany(emails: string[]): Promise<DeleteResult> {
    const users = Users.find({
        email: {
            $in: emails,
        },
    });
    return await users.deleteMany().exec();
}

async function exists(id: string): Promise<boolean> {
    const exists = Users.exists({ _id: id });
    return (!!exists.exec());
}

async function has(email: string): Promise<boolean> {
    const exists = await Users.exists({ email });
    return (!!exists);
}

async function getLoginInfo
(credentials: userOrEmail): Promise<CharacterSearchResult> {
    const user = await Users.findOne({
        $or: [
            { email: credentials.toLowerCase() },
            { username: credentials.toLowerCase() },
        ]
    }, USER_LOGIN_PROPS, {});
    return user;
}

async function read(id: string): Promise<CharacterSearchResult> {
    const user = Users.findOne({ _id: id });
    user.select(USER_STANDARD_PROPS);
    return user.exec();
}

async function readAll(): Promise<IUser[]> {
    const users =  Users.find();
    users.select(USER_STANDARD_PROPS);
    return users.exec();
}

async function readByEmail(email: string): Promise<CharacterSearchResult> {
    const user = Users.findOne({
        email
    });
    user.select(USER_STANDARD_PROPS);
    return user.exec();
}

async function update
(id: string, properties: UserUpdateProps): Promise<CharacterSearchResult> {
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
    getLoginInfo,
    has,
    read,
    readAll,
    readByEmail,
    update,
};
