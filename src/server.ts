import cors from "cors";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import emailRoutes from "./routes/email.routes";
import express from "express";
import bodyParser from "body-parser";

const server = express();

/* Configuring Express */
server.use(express.json());
server.use(cors());

/* Routes */
server.use(authRoutes);
server.use(userRoutes);
server.use(emailRoutes);

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.get("/api", (request: any, response: any) => {
    return response.send({ message: "API online!" });
});

export default server;