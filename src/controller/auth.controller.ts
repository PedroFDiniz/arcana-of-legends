import service from "../service/auth.service";
import { failed, succeeded } from "../utils/misc";

const signIn = async (request: any, response: any) => {
    try {
        const { email, password } = request.body;
        const result = await service.signIn(email, password);

        const message = `${result.user?.email} has signed in.`;
        return succeeded(response, 200, message, result);
    } catch (error: any) {
        return failed(response, 401, error.message);
    }
}

export { signIn };