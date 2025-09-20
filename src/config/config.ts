import { connectToLocalDB } from "../database/local.db.cfg";
import { connectToRemoteDB } from "../database/remote.db.cfg";
import { log } from "../utils/misc";
import dotenv from "dotenv";

async function loadEnviron() {
    log(`Loading Environment...`);
    const ENVIRON = `${process.env.NODE_ENV}`.toLowerCase().trim();
    process.env.NODE_ENV = ENVIRON;
    switch (ENVIRON) {
        case "development":
            dotenv.config({ path: `.env.${ENVIRON}`, quiet: true });
            break;
        case "production":
            dotenv.config({ path: `.env.${ENVIRON}`, quiet: true });
            break;
        default:
            dotenv.config({ path: `.env.default`, quiet: true });
            break;
    }
    checkVariables();
}

async function checkVariables() {
    log(`Checking environment variables...`);
    const REQUIRED_ENV_VARIABLES = [
        "NODE_ENV",
        "DB_URI",
        "PORT",
        "SALT_ROUNDS",
        "JWT_SECRET",
        "BASE_ADDRESS",
    ];

    let quantity = 0;
    const missing: string[] = [];
    for (const VARIABLE of REQUIRED_ENV_VARIABLES) {
        if (process.env[VARIABLE]) continue;
        missing.push(`${VARIABLE}`);
        quantity++;
    }

    if (missing.length === 0) return;

    const message =
        `Missing ${quantity} environment variable${(quantity!==1?"s":"")}: ` +
        `${missing.join(", ")}`;
    log(message);
    throw new Error(message);
}

async function startDatabase() {
    const ENVIRON = process.env.NODE_ENV;
    switch (ENVIRON) {
        case "development": return connectToRemoteDB();
        case "production":  return connectToRemoteDB();
        default:            return connectToLocalDB();
    }
}

export {
    loadEnviron,
    startDatabase,
};
