import JWT from "jsonwebtoken";
import service from "../service/user.service";
import { jwt_secret } from "../config/config";
import { failed } from "../utils/misc";
import { NextFunction, Request, Response } from "express";
import { IUser } from "../model/user";

const isSelfOrAdmin = async (request: Request, response: Response, next: NextFunction) => {
    authorize(request, response, next, "authorized");
}
const hasAdminRights = async (request: Request, response: Response, next: NextFunction) => {
    authorize(request, response, next, "admin");
}

const authorize = async (
        request: Request,
        response: Response,
        next: NextFunction,
        type: string
    ) => {

    const { authorization } = request.headers;

    if (!authorization) return failed(response, 401, "No Token");

    const parts = authorization.split(" ");
    const [scheme, token] = parts.length === 2? parts : [null, null];
    const regex = /^Bearer$/i;

    if (!scheme || !regex.test(scheme))
        failed(response, 401, "Bad Token Format");
    JWT.verify(token!, jwt_secret, async (error: unknown, decoded: any) => {
        if (error) return failed(response, 401, "Invalid Token");

        const user = await service.read(decoded.sub) as IUser | undefined;
        if (!userExists(user)) return failed(response, 400, "User not found");

        response.locals.authenticated = user._id;
        if (isBanned(user)) return failed(response, 400, "User is banned");
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

function userExists(user: any): user is IUser {
    return (user && user._id !== undefined);
}

const isAdmin = (user: any) => ["admin"].includes(user.accessLevel);
const isBanned = (user: any) => ["banned"].includes(user.accessLevel);
const isModerator = (user: any) => ["moderator"].includes(user.accessLevel);
const matchIDs = (user: any, request: Request) =>
    user._id.toString() === request.params.id;

export {
    isSelfOrAdmin,
    hasAdminRights,
};
