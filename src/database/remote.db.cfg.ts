import mongoose from "mongoose";
import { log } from "../utils/misc";

async function connectToRemoteDB() {
    mongoose.connection.on("error", (error: unknown) => {
        log(`Error while connecting to the ${process.env.NODE_ENV} Database.`);
        if (error instanceof Error) log(`${error.stack}`);
    });
    mongoose.connection.on("connected", () => {
        log(`Successfully connected to ${process.env.NODE_ENV} Database.`);
    });
    mongoose.connection.on("disconnected", () => {
        log(`Connection with ${process.env.NODE_ENV} Database lost.`);
    });
    mongoose.connection.on("close", () => {
        log(`Connection with ${process.env.NODE_ENV} Database closed.`);
    });
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.DB_URI!);
}

export {
    connectToRemoteDB,
};
