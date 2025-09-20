import request from "supertest";
import server from "../../src/server";
import { log } from "../../src/utils/misc";

let app = server.listen(45454, () => { log("Test server created."); });
describe("User tests", () => {
    afterAll((done: any) => {
        app.close(done);
    });

    test("POST /user - success", async () => {
        const response = await request(server).post("/user").send({
            username: "User1",
            email: "test@test.com",
            password: "12345",
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("result");
        expect(response.body.result).toHaveProperty("_id");
        expect(response.body.result).toHaveProperty("createdAt");
        expect(response.body.result?.username).toBe("User1");
        expect(response.body.result?.email).toBe("test@test.com");
    });
});