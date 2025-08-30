import mongoose from 'mongoose';
import { DATABASE_URL } from './globals';

let session: mongoose.ClientSession;

export const connect = async (dbName = 'ecom') => {
    if (mongoose.connection.readyState !== 0) {
        return;
    }

    try {
        await mongoose.connect(DATABASE_URL as string, { dbName });
    } catch (e: unknown) {
        // Propagate error to caller so the app can decide whether to start
        if (e instanceof Error) {
            console.error('Mongo connect error:', e.message);
        }
        throw e;
    }
};

export const disconnect = async (): Promise<void> => {
    if (mongoose.connection.readyState === 0) {
        console.warn('No Active Database connection');
        return;
    }
    await mongoose.connection.close();
};

export { session };
