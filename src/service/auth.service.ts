import JWT from "jsonwebtoken";
import { compareEncrypted as compare } from "../utils/misc";
import service from "./user.service";
const JWT_SECRET = process.env.JWT_SECRET!;
const EMAIL_OR_PWD = "Incorrect email or password";

async function signToken(id: any) {
    return JWT.sign({
        iss: "arcana-of-legends",
        sub: id,
        iat: new Date().getTime(),
    }, JWT_SECRET);
};

const signIn = async (email: string, password: string) => {
    const user = await service.readByEmail(email);
    if (!user) throw new Error(EMAIL_OR_PWD);

    const match = await compare(password, user.password);
    if (!match) throw new Error(EMAIL_OR_PWD);

    const token = await signToken(user._id);
    const result = {
        user: {
            _id: user._id,
            email: user.email
        },
        token: token,
    }
    return result;
}

export default {
    signIn,
};
