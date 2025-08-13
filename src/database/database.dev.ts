import mongoose from "mongoose";
import { log } from "../utils/misc";

async function connectToDevDB() {
    mongoose.connection.on("error", (error: unknown) => {
        log("Error while connecting to the DEVELOPMENT Database.");
        if (error instanceof Error) log(`${error.stack}`);
    });
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.DB_DEV!);
}

export {
    connectToDevDB,
};
