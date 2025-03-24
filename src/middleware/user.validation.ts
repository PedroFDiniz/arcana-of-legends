import { failed } from "../utils/misc";
import { encrypt } from "../utils/misc";
import { user as isValid } from "../utils/validation";

const validateCreation = async (request: any, response: any, next: Function) => {
    const { email, password } = request.body;
    if (!email || !isValid.email(email))
        return failed(response, 400, `Invalid email format: ${email}`);
    if (!password || !isValid.password(password))
        return failed(response, 400, `Invalid password format`);
    request.body.password = await encrypt(password);
};

const validateUpdate = async (request: any, response: any, next: Function) => {
    const { email, password } = request.body;

    if (!email && !password)
        return failed(response, 400, `All fields are empty`);
    if (email && !isValid.email(email))
        return failed(response, 400, `Invalid email format: ${email}`);
    if (password) {
        if (!isValid.password(password))
            return failed(response, 400, `Invalid password format`);
        request.body.password = await encrypt(password);
    }
    return next();
};

export { validateCreation, validateUpdate }