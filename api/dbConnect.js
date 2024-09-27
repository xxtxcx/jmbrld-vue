const MONGODB_URI = process.env.MONGODB_URI;
import { MongoClient, ServerApiVersion } from 'mongodb';

const client = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

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