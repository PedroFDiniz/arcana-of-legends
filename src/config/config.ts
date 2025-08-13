import { connectToLocalDB } from "../database/database.local";
import { connectToProdDB } from "../database/database.prod";
import { connectToDevDB } from "../database/database.dev";
import { log } from "../utils/misc";

async function loadEnviron() {
    const ENVIRON = process.env.NODE_ENV;
    switch (ENVIRON) {
        case "dev":
        case "prod":
            process.loadEnvFile(`../../.env.${ENVIRON}`);
            break;
        default:
            process.loadEnvFile("../../.env.default");
            break;
    }
    checkVariables();
}

async function checkVariables() {
    const REQUIRED_ENV_VARIABLES = [
        "DB_URI",
        "PORT",
        "SALT_ROUNDS",
        "JWT_SECRET",
        "BASE_ADDRESS",
    ];

    const missing: string[] = [];
    for (const VARIABLE of REQUIRED_ENV_VARIABLES) {
        if (VARIABLE in process.env) continue;
        missing.push(`${VARIABLE}`);
    }

    if (missing.length === 0) return;

    const message = `Missing environment variable(s): ${missing.join(", ")}`;
    log(message);
    throw new Error(message);
}

async function startDatabase() {
    const ENVIRON = process.env.NODE_ENV;
    switch (ENVIRON) {
        case "dev": return connectToDevDB();
        case "prod": return connectToProdDB();
        default: return connectToLocalDB();
    }
}

export {
    loadEnviron,
    startDatabase,
};
