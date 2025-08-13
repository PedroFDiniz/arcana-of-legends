import Users from "../model/user";

const destroy = async (id: string) => {
    return await Users.deleteOne({
        _id: id,
    });
}

const destroyMany = async (emails: string[]) => {
    return await Users.deleteMany({
        email: {
            $in: emails,
        }
    });
}

const has = async (email: string) => {
    return await Users.exists({ email });
}

const exists = async (id: string) => {
    return await Users.exists({ _id: id });
}

const confirmEmail = async (id: string) => {
    const result = await Users.findByIdAndUpdate(id, { emailConfirmed: true });
    return result;
}

const create = async (email: string, password: string) => {
    return await Users.create({
        email,
        password,
    });
}

const read = async (id: string) => {
    return await Users.findOne({ _id: id });
}

const readAll = async () => {
    return await Users.find().select("-password");
}

const readByEmail = async (email: string) => {
    return await Users.findOne({ email: email });
}

const update = async (id: string, email: string, password: string) => {
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
