import JWT from "jsonwebtoken";
import service from "../service/user.service";
import { failed } from "../utils/misc";
import { NextFunction, Request, Response } from "express";
import { IUser } from "../model/user";
const JWT_SECRET = process.env.JWT_SECRET!;

enum AuthType {
    IS_ADMIN,
    IS_ADMIN_OR_SELF,
}

async function isSelfOrAdmin
(request: Request, response: Response, next: NextFunction) {
    authorize(request, response, next, AuthType.IS_ADMIN_OR_SELF);
}

async function hasAdminRights
(request: Request, response: Response, next: NextFunction) {
    authorize(request, response, next, AuthType.IS_ADMIN);
}

async function authorize(
        request: Request,
        response: Response,
        next: NextFunction,
        type: AuthType
    ) {

    const { authorization } = request.headers;

    if (!authorization) return failed(response, 401, "No Token");

    const parts = authorization.split(" ");
    const [scheme, token] = parts.length === 2? parts : [null, null];
    const regex = /^Bearer$/i;

    if (!scheme || !regex.test(scheme))
        failed(response, 401, "Bad Token Format");
    JWT.verify(token!, JWT_SECRET, async (error: unknown, decoded: any) => {
        if (error) return failed(response, 401, "Invalid Token");

        const user = await service.read(decoded.sub) as IUser | undefined;
        if (!userExists(user)) return failed(response, 400, "User not found");

        response.locals.authenticated = user._id;
        if (isBanned(user)) return failed(response, 400, "User is banned");
        switch (type) {
            case AuthType.IS_ADMIN:
                if (!isAdmin(user))
                    return failed(response, 403, "Unauthorized user");
                break;
            case AuthType.IS_ADMIN_OR_SELF:
                if (!isAdmin(user) && !matchIDs(user, request))
                    return failed(response, 403, "Unauthorized user");
                break;
        } return next();
    });
}

function userExists(user: any): user is IUser {
    return (user && user?._id !== undefined);
}

function isAdmin(user: IUser) {
    return ["admin"].includes(user.accessLevel)
}

function isBanned(user: IUser) {
    return ["banned"].includes(user.accessLevel)
}

function isModerator(user: IUser) {
    return ["moderator", "admin"].includes(user.accessLevel)
}

function matchIDs(user: IUser, request: Request) {
    return user._id.toString() === request.params.id;
}

export {
    isSelfOrAdmin,
    hasAdminRights,
};
