import JWT from "jsonwebtoken";
import { jwt_secret } from "../config/config";
import { compareEncrypted as compare } from "../utils/misc";
import service from "./user.service";
const EMAIL_OR_PWD = "Incorrect email or password";

const signToken = async (id: any) => {
    return JWT.sign({
        iss: "explora-server",
        sub: id,
        iat: new Date().getTime(),
    }, jwt_secret);
};

const signIn = async (email: string, password: string) => {
    const user = await service.readByEmail(email);
    if (!user) throw new Error(EMAIL_OR_PWD);

    const match = await compare(password, user.password);
    if (!match) throw new Error(EMAIL_OR_PWD);

    const token = await signToken(user._id);
    return {
        "user": {
            id: user._id,
            email: user.email,
        },
        "token": token,
    };
}

export default { signIn };