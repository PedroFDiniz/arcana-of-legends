import { Request, Response } from "express";
import service from "../service/auth.service";
import { failed, succeeded } from "../utils/misc";

async function signIn(request: Request, response: Response): Promise<any> {
    try {
        const { email, password } = request.body;
        const result = await service.signIn(email, password);

        const message = `${result.user?.email} has signed in.`;
        return succeeded(response, 200, message, result);
    } catch (error: unknown) {
        if (error instanceof Error)
            return failed(response, 401, error.message);
        return failed(response, 500, "Unknown error");
    }
}

export {
    signIn,
};
