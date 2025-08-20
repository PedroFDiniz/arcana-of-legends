import bcrypt from "bcrypt";
import { Response } from "express";

const SALT_ROUNDS = process.env.SALT_ROUNDS!;
const WHITESPACE_PATTERN = /\s+g/;
const VALID_CODE_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const CONFIRMATION_CODE_SIZE = 6;

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
    result: any = undefined
    ): Response {
        log(message);
        if (!result) return response
            .status(status).send({ message: message });
        return response
            .status(status).send({ message: message, result: result });
}

const filterWhitespace = (sentence: string) => {
    return sentence.replace(WHITESPACE_PATTERN, " ").trim().split(" ");
};

function randomNumberBetween(start: number, end: number): number {
    return Math.floor(Math.random() * (start - end + 1)) + end;
}

function getRandomCodeCharacter(): string {
    const index = randomNumberBetween(0, (VALID_CODE_CHARACTERS.length - 1));
    return VALID_CODE_CHARACTERS[index];
}

function createConfirmationCode() {
    let code = "";
    for (let _ = 0; _ < CONFIRMATION_CODE_SIZE; _++) {
        code = code.concat(getRandomCodeCharacter());
    } return code;
}

export {
    compareEncrypted,
    createConfirmationCode,
    encrypt,
    failed,
    log,
    succeeded,
    filterWhitespace,
};
