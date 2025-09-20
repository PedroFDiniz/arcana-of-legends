import JWT from "jsonwebtoken";
import { compareEncrypted as compare, log } from "../utils/misc";
import service from "./user.service";
import { ObjectId } from "mongoose";
import { IUserDraft } from "../model/user";
const EMAIL_OR_PWD = "Incorrect email or password";


async function signToken(id: ObjectId) {
    const JWT_SECRET = process.env.JWT_SECRET!;
    return JWT.sign({
        iss: "arcana-of-legends",
        sub: id,
        iat: new Date().getTime(),
    }, JWT_SECRET);
};

const signIn = async (credentials: string, password: string) => {
    const user = await service.getLoginInfo(credentials);
    if (!user || !user.password) throw new Error(EMAIL_OR_PWD);

    const match = await compare(password, user.password!);
    if (!match) throw new Error(EMAIL_OR_PWD);
    delete user.password;

    const token = await signToken(user._id!);
    const result = { user, token, };
    return result;
}

export default {
    signIn,
};
