import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cachedClientPromise = null;

export async function connectToDatabase() {
  if (!cachedClientPromise) {
    const client = new MongoClient(MONGODB_URI);
    cachedClientPromise = client.connect();
  }

  const client = await cachedClientPromise;
  const db = client.db();

  return { client, db };
}