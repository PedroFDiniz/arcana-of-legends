import bcrypt from "bcrypt";
import { salt_rounds } from "../config/config";
import { Response } from "express";

const WHITESPACE_PATTERN = /\s+g/;

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

const failed = (response: Response, status: number, message: string) => {
    log(`Error ${status}: ${message}`);
    return response
        .status(status).send({ message: message });
}

const succeeded = (
    response: Response,
    status: number,
    message: string,
    result: any = undefined) => {
        log(message);
        if (!result) return response
            .status(status).send({ message: message });
        return response
            .status(status).send({ message: message, result: result });
}

const filterWhitespace = (sentence: string) => {
    return sentence.replace(WHITESPACE_PATTERN, " ").trim().split(" ");
};

export {
    compareEncrypted,
    encrypt,
    failed,
    log,
    succeeded,
};
