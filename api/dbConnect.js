// import { MongoClient } from 'mongodb';
// const uri = 'mongodb+srv://atata426:qhqfN8Ai0Qrr0hm@jmbrld.zbxwy.mongodb.net/?retryWrites=true&w=majority';
// let cachedClient = null;

// export async function connectToDatabase() {
//   if (cachedClient) {
//     return cachedClient;
//   }

//   const client = await MongoClient.connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });

//   cachedClient = client;
//   return client;
// }

//import { MongoClient } from 'mongodb';

const { MONGODB_URI } = process.env.MONGODB_URI;

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://atata426:Uv1Jo4R85Ag9RAWe@jmbrld.zbxwy.mongodb.net/?retryWrites=true&w=majority&appName=jmbrld";
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
// async function run() {
//   try {
//     // Connect the client to the server  (optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

//const MONGODB_URI = 'mongodb+srv://atata426:Uv1Jo4R85Ag9RAWe@jmbrld.zbxwy.mongodb.net/?retryWrites=true&w=majority&appName=jmbrld';
const MONGODB_URI1 = "mongodb+srv://atata426:Uv1Jo4R85Ag9RAWe@jmbrld.zbxwy.mongodb.net/?retryWrites=true&w=majority&appName=jmbrld";

import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://atata426:<db_password>@jmbrld.zbxwy.mongodb.net/?retryWrites=true&w=majority&appName=jmbrld";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
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
  throw new Error('Please define the MONGODB_URI environment variable');
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