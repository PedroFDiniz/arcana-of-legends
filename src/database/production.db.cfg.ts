import mongoose from "mongoose";
import { log } from "../utils/misc";

async function connectToProdDB() {
    mongoose.connection.on("error", (error: unknown) => {
        log("Error while connecting to the PRODUCTION Database.");
        if (error instanceof Error) log(`error.stack`);
    });
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.DB_PROD!);
}

export {
    connectToProdDB,
};
