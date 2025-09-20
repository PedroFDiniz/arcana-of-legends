import { Request, Response } from "express";
import service from "../service/auth.service";
import { fail, log, succeed } from "../utils/misc";

async function signIn(request: Request, response: Response): Promise<any> {
    try {
        const { credentials, password } = request.body;
        const result = await service.signIn(credentials, password);

        const message = `${result.user?.email} has signed in.`;
        return succeed(response, 200, message, result);
    } catch (error: unknown) {
        if (error instanceof Error) {
            log(error.stack!);
            return fail(response, 401, error.message);
        }
        return fail(response, 500, "Unknown error");
    }
}

export {
    signIn,
};
