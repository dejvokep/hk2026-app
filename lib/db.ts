import {MongoClient, WithId} from "mongodb";

const client = new MongoClient(process.env.MONGO_URL || "");
export const db = client.connect();

export const remapId = (doc: WithId<object>) => {
    // @ts-expect-error desc
    if (doc["users"]) doc["users"] = (doc["users"] as WithId<object>[]).map(remapId);

    return ({...doc, _id: doc._id.toHexString()})
}
