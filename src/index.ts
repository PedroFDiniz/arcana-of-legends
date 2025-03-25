import config from "./config/config";
import configDB from "./config/database.config";
import server from "./server";
import { log } from "./utils/misc";

/* Check variables and start databases */
config();
configDB();

/* Initializing server */
const PORT = process.env.PORT;
try {
    server.listen(PORT);
    log(`Server running on port ${PORT}.`);
} catch (error: any) {
    log(`Fatal Error: There is a possibility the port ${PORT} is already in use`);
}
