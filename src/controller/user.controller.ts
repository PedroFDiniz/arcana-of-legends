import { Request, Response } from "express";
import service from "../service/user.service";
import emailService from "../service/email.service";
import { log, failed, succeeded } from "../utils/misc";

async function confirmEmail(request: Request, response: Response): Promise<any> {
    const { key } = request.params;

    try {
        const user = await service.read(key);
        const confirmed = user?.emailConfirmed;
        if (!user) return failed(response, 404, `User not found`);
        if (confirmed) return failed(response, 400, `User email already validated`);
        await service.confirmEmail(key);
        return succeeded(response, 200, "Email confirmed");
    } catch (error: any) {
        return failed(response, 500, error.message);
    }
};

async function create(request: Request, response: Response): Promise<any> {
    const { email, password } = request.body;
    log(`Request to create user ${email}.`);

    try {
        const user = await service.create(
            email,
            password,
        );

        const data = {
            id: user._id,
            email: user.email,
        };
        emailService.sendConfirmation(user.email, user._id.toString());
        return succeeded(response, 200, `User ${user.email} created`, data);
    } catch(error: any) {
        return failed(response, 400, error.message);
    }
};

async function read(request: Request, response: Response): Promise<any> {
    const { id } = request.body;

    try {
        const user = await service.read(id);
        if (!user) return failed(response, 404, `User ${id} not found`);
        return succeeded(response, 200, `Found user ${id}`);
    } catch (error: any) {
        return failed(response, 500, error.message);
    }
};

async function readAll(request: Request, response: Response): Promise<any> {
    try {
        const users = await service.readAll();
        return succeeded(response, 200, `${users.length} user(s) read.`);
    } catch (error: any) {
        return failed(response, 500, error.message);
    }
};

async function update(request: Request, response: Response): Promise<any> {
    const { id } = request.params;
    const { email, password } = request.body;

    if (!await service.exists(id)) return failed(response, 400, `User ${id} not found`);
    try {
        const result = await service.update(id, email, password);
        return succeeded(response, 200, `Updated ${Object.keys(result)} of user ${id}`);
    } catch (error: any) {
        return failed(response, 500, error.message);
    }
};

async function destroy(request: Request, response: Response): Promise<any> {
    const { id } = request.params;
    try {
        const result = await service.destroy(id);
        if (result.deletedCount === 0) return failed(response, 400, `User ${id} not found`);
        return succeeded(response, 200, `Deleted user ${id}`);
    } catch (error: any) {
        return failed(response, 500, error.message);
    }
};

async function destroyMany(request: Request, response: Response): Promise<any> {
    const { emails } = request.body;
    try {
        const result = await service.destroyMany(emails);
        return succeeded(response, 200, `Deleted ${result.deletedCount} user(s)`);
    } catch (error: any) {
        return failed(response, 500, error.message);
    }
};

export {
    confirmEmail,
    create,
    read,
    readAll,
    update,
    destroy,
    destroyMany
};
