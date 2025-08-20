import { Request, Response } from "express";
import service, { UserCreateProps, UserUpdateProps } from "../service/user.service";
import { log, failed, succeeded } from "../utils/misc";
import { IUser } from "../model/user";
import { DeleteResult } from "mongoose";


async function create(request: Request, response: Response): Promise<any> {
    const { username, email, password } = request.body;
    log(`Request to create user ${username}.`);

    const userProperties: UserCreateProps = {
        username,
        email,
        password,
    };

    try {
        const user: IUser = await service.create(userProperties);

        return succeeded(response, 200, `User ${user.email} created`, user);
    } catch(error: unknown) {
        if (error instanceof Error)
            return failed(response, 400, `${error.stack}`);
        return failed(response, 500, "Unknown Error");
    }
};

async function read(request: Request, response: Response): Promise<any> {
    const { id } = request.body;

    try {
        const user = await service.read(id);
        if (!user) return failed(response, 404, `User ${id} not found`);
        return succeeded(response, 200, `Found user ${id}`);
    } catch(error: unknown) {
        if (error instanceof Error)
            return failed(response, 400, `${error.stack}`);
        return failed(response, 500, "Unknown Error");
    }
};

async function readAll(request: Request, response: Response): Promise<any> {
    try {
        const users = await service.readAll();
        return succeeded(response, 200, `${users.length} user(s) read.`);
    } catch(error: unknown) {
        if (error instanceof Error)
            return failed(response, 400, `${error.stack}`);
        return failed(response, 500, "Unknown Error");
    }
};

async function update(request: Request, response: Response): Promise<any> {
    const { id } = request.params;
    const { username, email, password } = request.body;

    if (!await service.exists(id))
        return failed(response, 404, `User ${id} not found`);

    const properties: UserUpdateProps = { };
    if (username) properties.username = username;
    if (email) properties.email = email;
    if (password) properties.password = password;

    try {
        const result = await service.update(id, properties);
        if (!result) return failed(response, 400, `Failed updating user ${id}`);
        return succeeded(response, 200, `Updated user ${result?.username}`);
    } catch(error: unknown) {
        if (error instanceof Error)
            return failed(response, 400, `${error.stack}`);
        return failed(response, 500, "Unknown Error");
    }
};

async function destroy(request: Request, response: Response): Promise<any> {
    const { id } = request.params;
    try {
        const result: DeleteResult = await service.destroy(id);
        if (!result.acknowledged)
            return failed(response, 400, `User ${id} not found`);
        return succeeded(response, 200, `Deleted user: ${result.deletedCount}`);
    } catch(error: unknown) {
        if (error instanceof Error)
            return failed(response, 400, `${error.stack}`);
        return failed(response, 500, "Unknown Error");
    }
};

async function destroyMany
(request: Request, response: Response): Promise<any> {
    const { emails } = request.body;
    try {
        const result: DeleteResult = await service.destroyMany(emails);
        const message = `Deleted user(s): ${result.deletedCount}`;
        return succeeded(response, 200, message);
    } catch(error: unknown) {
        if (error instanceof Error)
            return failed(response, 400, `${error.stack}`);
        return failed(response, 500, "Unknown Error");
    }
};

export {
    create,
    read,
    readAll,
    update,
    destroy,
    destroyMany
};
