import mongoose from "mongoose";
import startLocal from "./database.local.config";
import { log } from "../utils/misc";
const environment = process.env.NODE_ENV || "";

export default async () => {
    log(`Current environment: ${environment}`);

    const BD_URL = await (async () => {
        switch (environment.trim()) {
            case "dev":
                log("Current database: Development.");
                return `${process.env.DB_DEV}`;
            case "prod":
                log("Current database: Production.");
                return `${process.env.DB_PROD}`;
            default:
                log("Current database: Local.");
                return startLocal();
        }
    })();

    /* This sets the database up */
    mongoose.connection.on("error", (error) => {
        log("Error while connecting to the Database.");
    });
    mongoose.set("strictQuery", false);
    mongoose.connect(BD_URL);
}
