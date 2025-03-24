import bcrypt from "bcrypt";
import { salt_rounds } from "../config/config";

const encrypt = async (word: string) => {
    return await bcrypt.hash(word, parseInt(salt_rounds));
}

const compareEncrypted = async (word: string, encrypted: string) => {
    return await bcrypt.compare(word, encrypted);
}

const log = (message: string) => {
    if (!message) return;
    console.log(`[${(new Date()).toLocaleString('en-US')}]: ${message}`);
}

const failed = (response: any, status: number, message: string) => {
    log(`Error ${status}: ${message}`);
    return response
        .status(status).send({ message: message });
}

const succeeded = (
    response: any,
    status: number,
    message: string,
    result: any = undefined) => {
        log(message);
        if (!result) return response
            .status(status).send({ message: message });
        return response
            .status(status).send({ message: message, result: result });
}

export { log, encrypt, compareEncrypted, failed, succeeded };