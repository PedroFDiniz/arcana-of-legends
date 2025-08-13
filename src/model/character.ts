import { model, Schema } from "mongoose";

type ID = Schema.Types.ObjectId;

interface IDynamicStatistic {
    current: number;
    maximum: number;
}
interface ICharacter {
    _id: ID;
    name: string;
    level: number;
    health: IDynamicStatistic;
    mana: IDynamicStatistic;
    experience: IDynamicStatistic;
    createdAt: Date;
    updatedAt: Date;
}

const dynStatSchema = new Schema({
    current: {
        type: Number,
        default: 0,
    },
    maximum: {
        type: Number,
        default: 100,
    },
})

const charSchema = new Schema<ICharacter>({
    name: {
        type: String,
        required: [true, "A character must have a name"],
        lowercase: true,
        min: [2, "A name must be at least 2 characters long"],
        max: [70, "A name must be at most 70 characters long"],
    },
    level: {
        type: Number,
        default: 1,
        min: [1, "The minimum level of a character must be 1"],
        max: [60, "The maximum level of a character must be 60"],
    },
    health: {
        type: dynStatSchema,
        required: true,
    },
    mana: {
        type: dynStatSchema,
        required: true,
    },
    experience: {
        type: dynStatSchema,
        required: true,
    },
    createdAt: {

    }
});

export default model("Character", charSchema, "characters");
export { ICharacter };