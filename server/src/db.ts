import mongoose from 'mongoose';
import { DATABASE_URL } from './globals';
import { checkReplicaSet } from './utils/checkReplicaSet';

let session: mongoose.ClientSession;

export const connect = async (dbName = 'ecom') => {
    if (mongoose.connection.readyState !== 0) {
        return;
    }

    try {
        await mongoose.connect(DATABASE_URL as string, { dbName });
        const isReplicaSet = await checkReplicaSet();
        if (isReplicaSet) {
            console.log('Session started --> Connected to a replica set!');
            session = await mongoose.startSession();
        } else {
            console.log('Session not started --> Not Connected to a replica set!');
        }
    } catch (e: unknown) {
        if (e instanceof Error) {
            console.log(e.message, e);
        }
    }
};

export const disconnect = async (): Promise<void> => {
    if (mongoose.connection.readyState === 0) {
        console.warn('No Active Database connection');
        return;
    }
    session?.endSession();
    await mongoose.connection.close();
};

export { session };
