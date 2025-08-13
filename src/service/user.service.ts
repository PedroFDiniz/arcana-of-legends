import Users from "../model/user";

async function destroy(id: string) {
    return await Users.deleteOne({
        _id: id,
    });
}

async function destroyMany(emails: string[]) {
    return await Users.deleteMany({
        email: {
            $in: emails,
        }
    });
}

async function has(email: string) {
    return await Users.exists({ email });
}

async function exists(id: string) {
    return await Users.exists({ _id: id });
}

async function confirmEmail(id: string) {
    const result = await Users.findByIdAndUpdate(id, { emailConfirmed: true });
    return result;
}

async function create(email: string, password: string) {
    return await Users.create({
        email,
        password,
    });
}

async function read(id: string) {
    return await Users.findOne({ _id: id });
}

async function readAll() {
    return await Users.find().select("-password");
}

async function readByEmail(email: string) {
    return await Users.findOne({ email: email });
}

async function update(id: string, email: string, password: string) {
    const emailExists = await has(email);
    if (emailExists) throw new Error("That email is already in use");

    const changes: any = { };
    email && (changes.email = email);
    password && (changes.password = password);
    const old: any = await Users.findOneAndUpdate({ _id: id }, changes);

    const result: any = { };
    for (const [property, value] of Object.entries(changes)) {
        result[property] = {
            old: old[property],
            new: value,
        }
    }

    return result;
}

export default {
    confirmEmail,
    create,
    destroy,
    destroyMany,
    exists,
    has,
    read,
    readAll,
    readByEmail,
    update,
};
