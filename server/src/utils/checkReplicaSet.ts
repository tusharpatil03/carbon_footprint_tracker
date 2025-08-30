import mongoose from 'mongoose';
export const checkReplicaSet = async (): Promise<boolean> => {
  try {
    const adminDb = mongoose.connection.db?.admin();

    const result = await adminDb?.command({
      hello: 1,
    });

    if (!result) {
      return false;
    }

    if ('hosts' in result && 'setName' in result) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    throw new Error('Error in checking replica set');
  }
};
