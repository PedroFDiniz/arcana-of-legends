import { log } from '../utils/misc';
import { MongoMemoryServer } from 'mongodb-memory-server';

export default async () => {
    const mongodb = await MongoMemoryServer.create();
    const uri = mongodb.getUri();
    log("Creating a local database.");
    return uri;
};
