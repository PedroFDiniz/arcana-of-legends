import bcrypt from "bcrypt";
import { Response } from "express";

const SALT_ROUNDS = process.env.SALT_ROUNDS!;
const WHITESPACE_PATTERN = /\s+g/;

async function encrypt(word: string) {
    return await bcrypt.hash(word, parseInt(SALT_ROUNDS));
}

async function compareEncrypted(word: string, encrypted: string) {
    return await bcrypt.compare(word, encrypted);
}

function log(message: string): void {
    if (!message) return;
    console.log(`[${(new Date()).toLocaleString('en-US')}]: ${message}`);
}

function failed(response: Response, status: number, message: string) {
    log(`Error ${status}: ${message}`);
    return response
        .status(status).send({ message: message });
}

function succeeded(
    response: Response,
    status: number,
    message: string,
    result: any = undefined): Response {
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
    filterWhitespace,
};
