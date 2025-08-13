import { loadEnviron, startDatabase } from "./config/config";
import server from "./server";
import { log } from "./utils/misc";

/* Check variables and start databases */
loadEnviron();
startDatabase();

/* Initializing server */
const PORT = process.env.PORT;
try {
    server.listen(PORT);
    log(`Server running on port ${PORT}.`);
} catch (error: unknown) {
    if (error instanceof Error) log(error.stack!);
    log(`Fatal Error: There is a possibility the port ${PORT} is already in use`);
}
