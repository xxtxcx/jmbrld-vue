const MONGODB_URI = process.env.MONGODB_URI;
import { MongoClient } from 'mongodb';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable', MONGODB_URI, process.env.MONGODB_URI);
}

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }


  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("client1234")
  const db = client.db();
  console.log("db123")
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}