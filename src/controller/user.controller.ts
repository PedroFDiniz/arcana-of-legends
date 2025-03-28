import service from "../service/user.service";
import emailService from "../service/email.service";
import { log, failed, succeeded } from "../utils/misc";

const confirmEmail = async (request: any, response: any) => {
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

const create = async (request: any, response: any) => {
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
        emailService.confirmEmail(user.email, user._id.toString());
        return succeeded(response, 200, `User ${user.email} created`, data);
    } catch(error: any) {
        return failed(response, 400, error.message);
    }
};

const read = async (request: any, response: any) => {
    const { id } = request.body;

    try {
        const user = await service.read(id);
        if (!user) return failed(response, 404, `User ${id} not found`);
        return succeeded(response, 200, `Found user ${id}`);
    } catch (error: any) {
        return failed(response, 500, error.message);
    }
};

const readAll = async (request: any, response: any) => {
    try {
        const users = await service.readAll();
        return succeeded(response, 200, `${users.length} user(s) read.`);
    } catch (error: any) {
        return failed(response, 500, error.message);
    }
};

const update = async (request: any, response: any) => {
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

const destroy = async (request: any, response: any) => {
    const { id } = request.params;
    try {
        const result = await service.destroy(id);
        if (result.deletedCount === 0) return failed(response, 400, `User ${id} not found`);
        return succeeded(response, 200, `Deleted user ${id}`);
    } catch (error: any) {
        return failed(response, 500, error.message);
    }
};

const destroyMany = async (request: any, response: any) => {
    const { emails } = request.body;
    try {
        const result = await service.destroyMany(emails);
        return succeeded(response, 200, `Deleted ${result.deletedCount} user(s)`);
    } catch (error: any) {
        return failed(response, 500, error.message);
    }
};


export { confirmEmail, create, read, readAll, update, destroy, destroyMany }