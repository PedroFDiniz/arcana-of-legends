import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { log } from "../utils/misc";

async function connectToLocalDB() {
    mongoose.connection.on("error", (error: unknown) => {
        log("Error while connecting to a LOCAL Database.");
        if (error instanceof Error) log(`${error.stack}`);
    });
    mongoose.set("strictQuery", false);
    const LOCAL_INSTANCE = await MongoMemoryServer.create();
    const URI = LOCAL_INSTANCE.getUri();
    mongoose.connect(URI);
}

export {
    connectToLocalDB,
};
