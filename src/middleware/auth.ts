import JWT from "jsonwebtoken";
import service from "../service/user.service";
import { jwt_secret } from "../config/config";
import { failed } from "../utils/misc";

const isSelfOrAdmin = async (request: any, response: any, next: Function) => {
    authorize(request, response, next, "authorized");
}
const hasAdminRights = async (request: any, response: any, next: Function) => {
    authorize(request, response, next, "admin");
}

const authorize = async (
        request: any,
        response: any,
        next: Function,
        type: string
    ) => {

    const { authorization } = request.headers;

    if (!authorization) return failed(response, 401, "No Token");

    const parts = authorization.split(" ");
    const [scheme, token] = parts.length === 2? parts : [null, null];
    const regex = /^Bearer$/i;

    if (!scheme || !regex.test(scheme)) failed(response, 401, "Bad Token Format");
    JWT.verify(token, jwt_secret, async (error: any, decoded: any) => {
        if (error) return failed(response, 401, "Invalid Token");

        const user = await service.read(decoded.sub);
        if (user) response.locals.authenticated = user._id;
        if (isBanned(user)) return failed(response, 400, "User is blacklisted");
        switch (type) {
            case "admin":
                if (!isAdmin(user))
                    return failed(response, 403, "Unauthorized user");
                break;
            case "authorized":
                if (!isAdmin(user) && !matchIDs(user, request))
                    return failed(response, 403, "Unauthorized user");
                break;
        } return next();
    });
}



const isAdmin = (user: any) => ["admin"].includes(user.accessLevel);
const isBanned = (user: any) => ["banned"].includes(user.accessLevel);
const matchIDs = (user: any, request: any) => 
    user._id.toString() === request.params.id;

export { isSelfOrAdmin, hasAdminRights };